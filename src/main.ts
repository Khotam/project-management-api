import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Project-Management-Api');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug'],
  });

  app.enableCors();

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port, () => {
    logger.log(`The [Project Management Api] service is up and running on ${port} port`);
  });
}
bootstrap();
