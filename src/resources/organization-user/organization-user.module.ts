import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationUsers } from '../organization-user/entity/organization-users.entity';
import { OrganizationUsersController } from './organization-user.controller';
import { OrganizationUsersService } from './organization-user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationUsers]), UserModule],
  controllers: [OrganizationUsersController],
  providers: [OrganizationUsersService],
})
export class OrganizationUsersModule {}
