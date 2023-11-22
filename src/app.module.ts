import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { resolve } from 'path';
import * as process from 'process';

import config from '../config/config';
import { UserModule } from './resources/user/user.module';
import { OrganizationModule } from './resources/organization/organization.module';
import { ProjectModule } from './resources/project/project.module';
import { TaskModule } from './resources/task/task.module';
import { OrganizationUsersModule } from './resources/organization-user/organization-user.module';
import { RolesGuard } from './resources/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './resources/auth/auth.module';
import { AuthMiddleware } from './resources/auth/middlewares/auth.middleware';
import { StatisticsModule } from './resources/statistics/statistics.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        logging: configService.get('database.logging'),
        namingStrategy: new SnakeNamingStrategy(),
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        migrationsTableName: 'migrations',
        migrationsRun: true,
        maxQueryExecutionTime: 3000,
        migrations: [resolve(__dirname, '../migrations/*.{ts,js}')],
        migrationsTransactionMode: 'all',
        autoLoadEntities: true,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env-${process.env.NODE_ENV?.trim() || 'dev'}`,
      isGlobal: true,
      load: [config],
    }),
    UserModule,
    OrganizationModule,
    OrganizationUsersModule,
    ProjectModule,
    TaskModule,
    AuthModule,
    StatisticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
