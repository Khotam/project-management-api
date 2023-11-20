import { NestFactory } from '@nestjs/core';
import { TYPEORM_MODULE_OPTIONS } from '@nestjs/typeorm/dist/typeorm.constants';
import * as path from 'path';
import { DataSource } from 'typeorm';

import { AppModule } from '../src/app.module';

export const setup = async () => {
  const app = await NestFactory.create(AppModule);
  const typeOrmModuleOptions = app.get(TYPEORM_MODULE_OPTIONS);
  await app.close();

  return new DataSource({
    ...typeOrmModuleOptions,
    entities: [path.join(__dirname, '../src/resources/**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  });
};

export default setup();
