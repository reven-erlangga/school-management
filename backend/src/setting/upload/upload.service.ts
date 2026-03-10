import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SettingService } from '../setting.service';
import { MinioService } from '../../common/minio/minio.service';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  constructor(
    private readonly settingService: SettingService,
    private readonly minioService: MinioService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async handleUpload(group: string, key: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Specific validation based on key (logo vs favicon)
    if (key === 'logo') {
      await this.validateLogo(file);
    } else if (key === 'favicon') {
      await this.validateFavicon(file);
    }

    const uploadedFile = await this.minioService.uploadFile(file);

    const fileData = {
      url: uploadedFile.url,
      name: uploadedFile.name,
      type: uploadedFile.type,
      size: uploadedFile.size,
    };

    // Update the setting with the file data as JSON string
    await this.settingService.createOrUpdate(group, {
      [key]: JSON.stringify(fileData),
    });

    return {
      message: 'File uploaded successfully',
      data: fileData,
    };
  }

  private async validateLogo(file: Express.Multer.File) {
    // Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('Logo size must be less than 2MB');
    }

    // Format PNG/JPG/SVG
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Logo must be PNG, JPG, or SVG');
    }

    // Dimensions 200x200px, 1:1 aspect ratio
    // SVG doesn't always have fixed dimensions, so skip dimension check for SVG
    if (file.mimetype !== 'image/svg+xml') {
      const metadata = await sharp(file.buffer).metadata();
      if (metadata.width !== metadata.height) {
        throw new BadRequestException('Logo must have 1:1 aspect ratio');
      }
      // Strict 200x200 check? User said "dimensi 200x200px".
      // Often strict equality is annoying, but requirement seems specific.
      // Let's allow slightly larger if aspect ratio is correct? No, "dimensi 200x200px" usually means that size.
      // Or maybe "max 200x200"? I'll enforce 200x200 or allow resizing?
      // "Validasi aspect ratio untuk logo (1:1)" is explicit.
      // "dimensi 200x200px" is also explicit.
      // I'll check width/height.
      if (metadata.width !== 200 || metadata.height !== 200) {
        throw new BadRequestException('Logo dimensions must be 200x200px');
      }
    }
  }

  private async validateFavicon(file: Express.Multer.File) {
    // Max 100KB
    if (file.size > 100 * 1024) {
      throw new BadRequestException('Favicon size must be less than 100KB');
    }

    // Format ICO/PNG
    const allowedMimeTypes = [
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/png',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Favicon must be ICO or PNG');
    }

    // Dimensions 32x32px or 64x64px
    // ICO can contain multiple sizes, sharp might pick one.
    if (file.mimetype === 'image/png') {
      const metadata = await sharp(file.buffer).metadata();
      const validSizes = [32, 64];
      if (
        !validSizes.includes(metadata.width || 0) ||
        !validSizes.includes(metadata.height || 0)
      ) {
        throw new BadRequestException(
          'Favicon dimensions must be 32x32px or 64x64px',
        );
      }
      if (metadata.width !== metadata.height) {
        throw new BadRequestException('Favicon must be square');
      }
    }
  }
}
