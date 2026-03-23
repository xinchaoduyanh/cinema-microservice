import { registerAs } from '@nestjs/config';

export const uploadLambdaConfiguration = registerAs('uploadLambda', () => ({
  functionName: process.env.UPLOAD_LAMBDA_FUNCTION_NAME,
  region: process.env.UPLOAD_LAMBDA_REGION || process.env.AWS_REGION || process.env.AWS_S3_REGION,
  maxSizeBytes: Number(process.env.UPLOAD_MAX_SIZE_BYTES || 10 * 1024 * 1024),
  allowedMimeTypes: (process.env.UPLOAD_ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  defaultFolder: process.env.UPLOAD_DEFAULT_FOLDER || 'uploads',
  stagingFolder: process.env.UPLOAD_STAGING_FOLDER || '_incoming',
}));
