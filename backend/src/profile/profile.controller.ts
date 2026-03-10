import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @Put()
  async updateProfile(
    @Req() req,
    @Body() body: { name?: string; email?: string },
  ) {
    return this.profileService.updateProfile(req.user.id, body);
  }

  @Put('password')
  async changePassword(
    @Req() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Current and new password are required');
    }
    return this.profileService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `profile-${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const isExtensionAllowed = /\.(jpg|jpeg|png|gif|ico|svg|webp)$/i.test(
          file.originalname,
        );
        const isMimeTypeAllowed =
          /image\/(jpeg|png|gif|x-icon|vnd\.microsoft\.icon|svg\+xml|webp)/.test(
            file.mimetype,
          );

        if (!isExtensionAllowed || !isMimeTypeAllowed) {
          return cb(
            new BadRequestException(
              `File type not allowed! (${file.originalname} / ${file.mimetype})`,
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadProfileImage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadProfileImage(req.user.id, file);
  }
}
