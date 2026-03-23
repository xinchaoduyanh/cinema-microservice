export interface UploadFileOptions {
  folder?: string;
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  metadata?: Record<string, string>;
}

export interface UploadFileResult {
  url: string;
  key: string;
  fileName: string;
  contentType: string;
  size: number;
}
