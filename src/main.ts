import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.use(helmet({
    contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false
  }));
  app.use(compression());
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));

  await app.listen(port);
}
bootstrap();
