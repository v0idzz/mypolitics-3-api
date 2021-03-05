import { Controller, Get, Query, Res } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Response } from 'express';

const getOptions = (data: string): Record<string, string> => {
  const dataObject = Buffer.from(data, 'base64').toString();
  return JSON.parse(dataObject);
};

@Controller('utils')
export class UtilsController {
  constructor(
    private readonly utilsService: UtilsService,
  ) {}


  @Get('images')
  async getImage(
    @Res() res: Response,
    @Query() { data, template }: { data: string, template: string }
  ) {
    const buffer = await this.utilsService.getTemplateImage(template, getOptions(data));

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(buffer, 'binary');
  }
}
