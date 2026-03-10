import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);
  private readonly bucketName = 'public';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('MINIO_PORT', 9000),
      useSSL:
        this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get<string>(
        'MINIO_ACCESS_KEY',
        'minioadmin',
      ),
      secretKey: this.configService.get<string>(
        'MINIO_SECRET_KEY',
        'minioadmin',
      ),
    });

    await this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket '${this.bucketName}' created.`);
        await this.setBucketPolicyPublic(this.bucketName);
      }
    } catch (error) {
      this.logger.error('Error initializing MinIO bucket', error);
    }
  }

  private async setBucketPolicyPublic(bucketName: string) {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    this.logger.log(`Bucket '${bucketName}' policy set to public read.`);
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; name: string; size: number; type: string }> {
    const { buffer, originalname, mimetype } = file;
    let fileBuffer = buffer;
    let fileName = originalname;
    let contentType = mimetype;

    // Validate and Compress
    if (mimetype.startsWith('image/')) {
      fileBuffer = await this.compressImage(buffer);
      // Ensure extension matches content type if changed, but sharp keeps original format by default or converts
      // For simplicity, we keep original name but maybe different size
    } else if (mimetype.startsWith('video/')) {
      const result = await this.compressVideo(buffer, originalname);
      fileBuffer = result.buffer;
      fileName = result.filename; // Might change extension
      contentType = 'video/mp4'; // We enforce mp4 for video compression
    }

    // Generate hashed filename
    const hash = crypto
      .createHash('md5')
      .update(`${Date.now()}-${fileName}`)
      .digest('hex');
    const ext = path.extname(fileName);
    const hashedFileName = `${hash}${ext}`;

    // Upload
    await this.minioClient.putObject(
      this.bucketName,
      hashedFileName,
      fileBuffer,
      fileBuffer.length,
      {
        'Content-Type': contentType,
      },
    );

    const protocol =
      this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true'
        ? 'https'
        : 'http';
    const host = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('MINIO_PORT', 9000);

    // Construct Public URL
    // Use MINIO_PUBLIC_URL if defined, otherwise fallback to constructed URL
    const publicUrlBase = this.configService.get<string>('MINIO_PUBLIC_URL');
    let publicUrl: string;

    if (publicUrlBase) {
      publicUrl = `${publicUrlBase}/${this.bucketName}/${hashedFileName}`;
    } else {
      const protocol =
        this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true'
          ? 'https'
          : 'http';
      // For public access from browser, we usually want localhost if dev, or the domain.
      // But inside docker, MINIO_ENDPOINT is 'minio'.
      // If we are not using MINIO_PUBLIC_URL, we default to localhost:9000 for dev convenience.
      const port = this.configService.get<number>('MINIO_PORT', 9000);
      publicUrl = `http://localhost:${port}/${this.bucketName}/${hashedFileName}`;
    }

    return {
      url: publicUrl,
      name: fileName,
      size: fileBuffer.length,
      type: contentType,
    };
  }

  private async compressImage(buffer: Buffer): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      if (metadata.size && metadata.size > 1024 * 1024) {
        // > 1MB
        // Compress
        // Convert to jpeg/png with quality reduction or resize if huge
        // Simple strategy: resize to max 1920 width if larger, and reduce quality
        if (metadata.width && metadata.width > 1920) {
          image.resize(1920);
        }

        if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
          return await image.jpeg({ quality: 80 }).toBuffer();
        } else if (metadata.format === 'png') {
          return await image
            .png({ quality: 80, compressionLevel: 8 })
            .toBuffer();
        } else if (metadata.format === 'webp') {
          return await image.webp({ quality: 80 }).toBuffer();
        }
      }
      return buffer;
    } catch (error) {
      this.logger.warn('Image compression failed, using original', error);
      return buffer;
    }
  }

  private async compressVideo(
    buffer: Buffer,
    originalName: string,
  ): Promise<{ buffer: Buffer; filename: string }> {
    return new Promise((resolve, reject) => {
      const tempInput = path.join(
        '/tmp',
        `input-${Date.now()}-${originalName}`,
      );
      const tempOutput = path.join('/tmp', `output-${Date.now()}.mp4`);

      fs.writeFileSync(tempInput, buffer);

      ffmpeg(tempInput)
        .output(tempOutput)
        .videoCodec('libx264')
        .size('?x720') // 720p
        .outputOptions([
          '-preset fast',
          '-crf 23', // Good balance
        ])
        .on('end', () => {
          const outBuffer = fs.readFileSync(tempOutput);
          // Cleanup
          fs.unlinkSync(tempInput);
          fs.unlinkSync(tempOutput);
          resolve({ buffer: outBuffer, filename: path.basename(tempOutput) });
        })
        .on('error', (err) => {
          this.logger.error('Video compression error', err);
          // Cleanup input if exists
          if (fs.existsSync(tempInput)) fs.unlinkSync(tempInput);
          if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
          // Fallback to original? Or reject?
          // User requirement: "Kompresi video ... dengan target resolusi 720p"
          // If it fails (e.g. ffmpeg not installed), maybe reject or return original.
          // Let's reject to be safe on requirements.
          reject(err);
        })
        .run();
    });
  }

  async getFileMetadata(url: string) {
    // Extract key from URL
    // TODO: Implement if needed for specific metadata retrieval from MinIO
    return null;
  }
}
