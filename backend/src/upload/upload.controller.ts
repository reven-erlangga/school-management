import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('settings/upload')
export class UploadController {
  @Post('logo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `logo-${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const isExtensionAllowed = /\.(jpg|jpeg|png|gif|ico|svg|webp)$/i.test(file.originalname);
      const isMimeTypeAllowed = /image\/(jpeg|png|gif|x-icon|vnd\.microsoft\.icon|svg\+xml|webp)/.test(file.mimetype);

      if (!isExtensionAllowed || !isMimeTypeAllowed) {
        return cb(new BadRequestException(`File type not allowed! (${file.originalname} / ${file.mimetype})`), false);
      }
      cb(null, true);
    }
  }))
  uploadLogo(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    const apiUrl = process.env.PUBLIC_API_URL || 'http://localhost:3001';
    return {
      url: `${apiUrl}/uploads/${file.filename}`
    };
  }

  @Post('favicon')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `favicon-${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const isExtensionAllowed = /\.(jpg|jpeg|png|gif|ico|svg|webp)$/i.test(file.originalname);
      const isMimeTypeAllowed = /image\/(jpeg|png|gif|x-icon|vnd\.microsoft\.icon|svg\+xml|webp)/.test(file.mimetype);

      if (!isExtensionAllowed || !isMimeTypeAllowed) {
        return cb(new BadRequestException(`File type not allowed! (${file.originalname} / ${file.mimetype})`), false);
      }
      cb(null, true);
    }
  }))
  uploadFavicon(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    const apiUrl = process.env.PUBLIC_API_URL || 'http://localhost:3001';
    return {
      url: `${apiUrl}/uploads/${file.filename}`
    };
  }
}
