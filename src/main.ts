import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import * as packageJson from '../package.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DbExceptionsFilter } from './shared/db-exception.filter';

async function bootstrap(): Promise<void> {
  const version = packageJson.version;
  const logger = new Logger('Project-Management-Api');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug'],
  });

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalFilters(new DbExceptionsFilter()).useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('REST API')
    .setDescription(`Project Management App REST API (v.${version})`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port, () => {
    logger.log(`The [Project Management Api] service is up and running on ${port} port`);
  });
}
bootstrap();
