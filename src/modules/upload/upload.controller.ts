import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MinioService } from '../minio/minio.service';
import sharp  from 'sharp';
import { createPublicPath, createUniqueFilename } from '../../shared/utils/file-upload.util';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly minioService: MinioService,
  ) {}

  @Post('icon')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIcon(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const fileResized = await sharp(file.buffer)
      .resize({ width: 32, height: 32, background: 'transparent' })
      .toBuffer();

    const fileName = createUniqueFilename(file);
    const filePath = createPublicPath('icons', fileName);
    return await this.minioService.uploadFileToFilePath(file, fileResized, filePath);
  }
}
