import { Express } from 'express';

export interface IMinioService {
  expiryTime: number;

  uploadFileToFilePath(meta: Express.Multer.File, file: Buffer, filePath: string): Promise<string>;
  getPresignedUrl(filePath: string): Promise<string>;
}
