import { Injectable } from '@nestjs/common';
import mvspTemplate from './templates/mvsp';
import oeTemplate from './templates/oe';
import rpTemplate from './templates/rp';
import interviewTemplate from './templates/interview';
import dmTemplate from './templates/dm';
import nodeHtmlToImage from 'node-html-to-image';

const imagesTemplates = {
  'mvsp': mvspTemplate,
  'oe': oeTemplate,
  'rp': rpTemplate,
  'dm': dmTemplate,
  'interview': interviewTemplate,
};

@Injectable()
export class UtilsService {
  async getTemplateImage(templateName: string, content: Record<string, string>): Promise<any> {
    const template = imagesTemplates[templateName];

    return await nodeHtmlToImage({
      content,
      html: `<html>
          <head>
            <style>
              body {
                width: 900px;
                height: 500px;
              }
            </style>
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;700&display=swap" rel="stylesheet">
          </head>
          <body>
            ${template}
          </body>
        </html>
        `,
    });
  }
}
