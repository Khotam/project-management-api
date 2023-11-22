import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';

import { User } from '../user/entity/user.entity';
import { OrganizationUsers } from './entity/organization-users.entity';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';

@Injectable()
export class OrganizationUsersService {
  logger = new Logger(OrganizationUsersService.name);
  organizationUserstableName = 'organization_users';
  userstableName = 'users';

  constructor(
    @InjectRepository(OrganizationUsers) private orgUsersRepository: Repository<OrganizationUsers>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(orgId: number, { createdBy, name, role }: CreateOrganizationUserDto) {
    await this.orgUsersRepository.query('BEGIN;');

    try {
      const [{ id: userId }] = await this.userRepository.query(
        `INSERT INTO ${this.userstableName} (name, role, "createdBy") VALUES ($1, $2, $3) RETURNING id`,
        [name, role, createdBy],
      );

      await this.orgUsersRepository.query(
        `INSERT INTO ${this.organizationUserstableName} ("orgId", "userId") VALUES ($1, $2)`,
        [orgId, userId],
      );

      await this.orgUsersRepository.query('COMMIT;');
      this.logger.log('Created successfully');
    } catch (error) {
      this.logger.error(error?.message, error);
      await this.orgUsersRepository.query('ROLLBACK;');
      throw new TypeORMError(error);
    }
  }
}
