import { uploadLambdaConfiguration } from '@app/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Module } from '../aws-s3';
import { UploadService } from './upload.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(uploadLambdaConfiguration), AwsS3Module],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
