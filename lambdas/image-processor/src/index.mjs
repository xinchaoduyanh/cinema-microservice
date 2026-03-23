import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import path from 'node:path';
import crypto from 'node:crypto';

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET_NAME;
const publicBaseUrl =
  process.env.AWS_S3_PUBLIC_BASE_URL ||
  `https://${bucket}.s3.${region}.amazonaws.com`;
const defaultFolder = process.env.UPLOAD_DEFAULT_FOLDER || 'uploads';
const stagingFolder = process.env.UPLOAD_STAGING_FOLDER || '_incoming';
const maxSizeBytes = Number(process.env.UPLOAD_MAX_SIZE_BYTES || 10 * 1024 * 1024);
const allowedMimeTypes = (process.env.UPLOAD_ALLOWED_MIME_TYPES ||
  'image/jpeg,image/png,image/webp')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const s3Client = new S3Client({ region });

const sanitizeFileName = (fileName) => {
  const ext = path.extname(fileName || '').toLowerCase();
  const baseName = path.basename(fileName || 'upload', ext);
  const safeBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'upload';

  return `${Date.now()}-${crypto.randomUUID()}-${safeBase}${ext}`;
};

const response = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  let sourceKey;

  try {
    if (!bucket) {
      return response(500, {
        success: false,
        message: 'AWS_S3_BUCKET_NAME is not configured',
      });
    }

    const payload = typeof event === 'string' ? JSON.parse(event) : event;
    const {
      sourceKey: requestSourceKey,
      fileName,
      contentType,
      fileSize,
      folder,
      maxSizeBytes: requestMaxSizeBytes,
      allowedMimeTypes: requestAllowedMimeTypes,
      metadata,
    } = payload || {};

    sourceKey = requestSourceKey;

    if (!fileName || !contentType || !sourceKey) {
      return response(400, {
        success: false,
        message: 'sourceKey, fileName and contentType are required',
      });
    }

    const effectiveMaxSize = Number(requestMaxSizeBytes || maxSizeBytes);
    const effectiveAllowedMimeTypes =
      Array.isArray(requestAllowedMimeTypes) && requestAllowedMimeTypes.length
        ? requestAllowedMimeTypes
        : allowedMimeTypes;

    const normalizedStagingFolder = stagingFolder.replace(/^\/|\/$/g, '');

    if (!sourceKey.startsWith(`${normalizedStagingFolder}/`)) {
      return response(400, {
        success: false,
        message: 'Invalid staging source key',
      });
    }

    const sourceObject = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: sourceKey,
      }),
    );
    const bodyBuffer = Buffer.from(await sourceObject.Body.transformToByteArray());
    const detectedContentType = sourceObject.ContentType || contentType;

    if (effectiveAllowedMimeTypes.length && !effectiveAllowedMimeTypes.includes(detectedContentType)) {
      return response(400, {
        success: false,
        message: `Unsupported file type: ${detectedContentType}`,
      });
    }

    if (bodyBuffer.byteLength > effectiveMaxSize) {
      return response(400, {
        success: false,
        message: `File exceeds maximum size of ${effectiveMaxSize} bytes`,
      });
    }

    if (fileSize && Number(fileSize) !== bodyBuffer.byteLength) {
      return response(400, {
        success: false,
        message: 'Declared file size does not match the received payload',
      });
    }

    const finalFileName = sanitizeFileName(fileName);
    const finalFolder = (folder || defaultFolder).replace(/^\/|\/$/g, '');
    const key = finalFolder ? `${finalFolder}/${finalFileName}` : finalFileName;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bodyBuffer,
        ContentType: detectedContentType,
        Metadata: metadata,
      }),
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: sourceKey,
      }),
    );

    return response(200, {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: `${publicBaseUrl.replace(/\/+$/, '')}/${encodeURI(key)}`,
        key,
        fileName: finalFileName,
        contentType: detectedContentType,
        size: bodyBuffer.byteLength,
      },
    });
  } catch (error) {
    if (sourceKey) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: sourceKey,
          }),
        );
      } catch {
        // Ignore cleanup failures because the original error is more important.
      }
    }

    return response(500, {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown upload error',
    });
  }
};
