import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MinioModule } from '../minio/minio.module';
import { MinioService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UploadController],
  providers: [MinioService, ConfigService],
  imports: [MinioModule]
})
export class UploadModule {}
