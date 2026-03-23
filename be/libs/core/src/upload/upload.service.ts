import { uploadLambdaConfiguration } from '@app/common';
import { FileValidationPipe } from '@app/common';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { AwsS3Service } from '../aws-s3';
import { UploadFileOptions, UploadFileResult } from './upload.interface';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly lambdaClient: LambdaClient;

  constructor(
    @Inject(uploadLambdaConfiguration.KEY)
    private readonly uploadConfig: ConfigType<typeof uploadLambdaConfiguration>,
    private readonly awsS3Service: AwsS3Service,
  ) {
    this.lambdaClient = new LambdaClient({
      region: this.uploadConfig.region,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadFileOptions = {},
  ): Promise<UploadFileResult> {
    const stagingFolder =
      (
        this.uploadConfig as ConfigType<typeof uploadLambdaConfiguration> & {
          stagingFolder?: string;
        }
      ).stagingFolder || '_incoming';
    const allowedMimeTypes = options.allowedMimeTypes?.length
      ? options.allowedMimeTypes
      : this.uploadConfig.allowedMimeTypes;
    const maxSizeBytes = options.maxSizeBytes || this.uploadConfig.maxSizeBytes;

    new FileValidationPipe({
      maxSize: maxSizeBytes,
      allowedTypes: allowedMimeTypes,
    }).transform(file);

    if (!this.uploadConfig.functionName) {
      throw new InternalServerErrorException(
        'UPLOAD_LAMBDA_FUNCTION_NAME is not configured',
      );
    }

    const sourceFileName = this.createSourceFileName(file.originalname);
    const { fileKey: sourceKey } = await this.awsS3Service.uploadFile(
      sourceFileName,
      file.mimetype,
      file.buffer,
      stagingFolder,
    );

    const payload = {
      sourceKey,
      fileName: file.originalname,
      contentType: file.mimetype,
      fileSize: file.size,
      folder: options.folder || this.uploadConfig.defaultFolder,
      allowedMimeTypes,
      maxSizeBytes,
      metadata: options.metadata || {},
    };

    let response;

    try {
      response = await this.lambdaClient.send(
        new InvokeCommand({
          FunctionName: this.uploadConfig.functionName,
          InvocationType: 'RequestResponse',
          Payload: Buffer.from(JSON.stringify(payload)),
        }),
      );
    } catch (error) {
      await this.safeDeleteSourceFile(sourceKey);
      throw error;
    }

    if (response.FunctionError) {
      this.logger.error(`Upload lambda failed: ${response.FunctionError}`);
      await this.safeDeleteSourceFile(sourceKey);
      throw new InternalServerErrorException('Upload lambda execution failed');
    }

    const rawPayload = response.Payload
      ? Buffer.from(response.Payload).toString('utf8')
      : '{}';

    const parsed = JSON.parse(rawPayload || '{}');
    const resultBody = parsed?.body
      ? typeof parsed.body === 'string'
        ? JSON.parse(parsed.body)
        : parsed.body
      : parsed;

    if (!resultBody?.success || !resultBody?.data?.url) {
      this.logger.error(`Upload lambda returned invalid payload: ${rawPayload}`);
      await this.safeDeleteSourceFile(sourceKey);
      throw new InternalServerErrorException(
        resultBody?.message || 'Upload lambda returned an invalid response',
      );
    }

    return resultBody.data as UploadFileResult;
  }

  private createSourceFileName(originalName: string): string {
    const extension = path.extname(originalName || '').toLowerCase();
    const baseName = path.basename(originalName || 'upload', extension);
    const safeBaseName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'upload';

    return `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}${extension}`;
  }

  private async safeDeleteSourceFile(sourceKey: string): Promise<void> {
    try {
      await this.awsS3Service.deleteFile(sourceKey);
    } catch (error) {
      this.logger.warn(`Failed to clean up staging file ${sourceKey}: ${String(error)}`);
    }
  }
}
