import { Injectable } from '@nestjs/common';
import mvspTemplate from './templates/mvsp';
import oeTemplate from './templates/oe';
import rpTemplate from './templates/rp';
import interviewTemplate from './templates/interview';
import dmTemplate from './templates/dm';
import quizTemplate from './templates/quiz';
import pollTemplate from './templates/poll';
import nodeHtmlToImage from 'node-html-to-image';

const imagesTemplates = {
  'mvsp': mvspTemplate,
  'oe': oeTemplate,
  'rp': rpTemplate,
  'dm': dmTemplate,
  'interview': interviewTemplate,
  'quiz': quizTemplate,
  'poll': pollTemplate,
};

@Injectable()
export class UtilsService {
  async getTemplateImage(templateName: string, content: Record<string, string>): Promise<any> {
    const template = imagesTemplates[templateName];

    const prodArgs = {
      args: ['--no-sandbox'],
      executablePath: 'google-chrome-stable'
    };

    const sizes = {
      'poll': () => {
        const width = (content.parties.length * (96 + 16)) + 256;
        return [Math.max(width, 1056), 1056];
      },
      'default': () => [900, 500]
    };

    const [width, height] = (sizes[templateName] || sizes.default)();

    return await nodeHtmlToImage({
      content,
      puppeteerArgs: process.env.NODE_ENV === 'production' ? prodArgs : { args: ['--no-sandbox'] },
      html: `<html>
          <head>
            <style>
              body {
                width: ${width}px;
                height: ${height}px;
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
