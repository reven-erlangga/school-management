# MinIO Upload Module

This module provides a unified interface for uploading files to MinIO with automatic compression for images and videos.

## Features

- **MinIO Integration**: Automatically creates `public` bucket and sets public read policy.
- **Image Compression**: Uses `sharp` to resize (max 1920px width) and compress (>1MB) images (JPEG, PNG, WebP).
- **Video Compression**: Uses `ffmpeg` to transcode videos to MP4 (720p, H.264).
- **File Validation**:
  - Logo: Max 2MB, 200x200px, 1:1 aspect ratio.
  - Favicon: Max 100KB, 32x32px or 64x64px.
- **Hashed Filenames**: Prevents filename collisions.

## Configuration

Ensure `docker-compose.yaml` has MinIO service running.
Environment variables:
- `MINIO_ENDPOINT`: Host (default: `localhost` or `minio` in docker)
- `MINIO_PORT`: Port (default: `9000`)
- `MINIO_ACCESS_KEY`: Access Key
- `MINIO_SECRET_KEY`: Secret Key
- `MINIO_USE_SSL`: `true` or `false`

## Usage

### Inject Service

```typescript
import { MinioService } from 'src/common/minio/minio.service';

constructor(private readonly minioService: MinioService) {}
```

### Upload File

```typescript
const result = await this.minioService.uploadFile(file);
console.log(result.url); // Public URL
```

## Endpoints (Upload Module)

### Upload Logo
`POST /settings/:group/upload/logo`
- **Body**: `multipart/form-data` with `file` field.
- **Constraints**: 200x200px, Max 2MB.

### Upload Favicon
`POST /settings/:group/upload/favicon`
- **Body**: `multipart/form-data` with `file` field.
- **Constraints**: 32x32px or 64x64px, Max 100KB.

## Dependencies

- `minio`
- `sharp`
- `fluent-ffmpeg`
- `ffmpeg` (binary required in environment/container)
