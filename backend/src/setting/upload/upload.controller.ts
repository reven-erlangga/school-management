import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

@ApiTags('Settings Upload')
@Controller('settings/:group/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('logo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Use memory storage to get buffer
    }),
  )
  async uploadLogo(
    @Param('group') group: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.handleUpload(group, 'logo', file);
  }

  @Post('favicon')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Use memory storage to get buffer
    }),
  )
  async uploadFavicon(
    @Param('group') group: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.handleUpload(group, 'favicon', file);
  }
}
