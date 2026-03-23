# Image Processor Lambda

This Lambda receives a staged S3 object key from the backend, validates mime type and size,
renames the file, moves it into the final S3 location, and returns the public URL.

## Environment variables

Use values from `.env.example` or `template.yaml`:

- `AWS_S3_BUCKET_NAME`
- `AWS_S3_PUBLIC_BASE_URL`
- `UPLOAD_MAX_SIZE_BYTES`
- `UPLOAD_ALLOWED_MIME_TYPES`
- `UPLOAD_DEFAULT_FOLDER`
- `UPLOAD_STAGING_FOLDER`

## Deploy with SAM

```bash
cd lambdas/image-processor
npm install
sam build
sam deploy --guided
```

## Backend env

Set these values in the backend:

- `UPLOAD_LAMBDA_FUNCTION_NAME=cinema-image-processor`
- `UPLOAD_LAMBDA_REGION=ap-southeast-1`
- `UPLOAD_MAX_SIZE_BYTES=10485760`
- `UPLOAD_ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp`
- `UPLOAD_DEFAULT_FOLDER=uploads`
- `UPLOAD_STAGING_FOLDER=_incoming`
