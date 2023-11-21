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
        `INSERT INTO ${this.userstableName} (name, role, created_by) VALUES ($1, $2, $3) RETURNING id`,
        [name, role, createdBy],
      );

      await this.orgUsersRepository.query(
        `INSERT INTO ${this.organizationUserstableName} (org_id, user_id) VALUES ($1, $2)`,
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

  //   async findAll() {
  //     const itemsPromise = this.orgsRepository.query(`SELECT * FROM ${this.tableName}`);
  //     const countPromise = this.orgsRepository.query(`SELECT COUNT(*) FROM ${this.tableName}`);
  //     const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
  //     this.logger.log(`Items count: ${count.count}`);

  //     return { items, count: count.count };
  //   }

  //   async findOne(id: number): Promise<Organization> {
  //     const [org] = await this.orgsRepository.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
  //     if (!org) {
  //       this.logger.debug('Item not found', id);
  //       throw new NotFoundException({ message: `Item with id: ${id} not found` });
  //     }
  //     this.logger.log(`Item found`, org);
  //     return org;
  //   }

  //   async update(id: number, { created_by, name }: UpdateOrganizationDto) {
  //     const org = await this.findOne(id);
  //     await this.orgsRepository.query(`UPDATE ${this.tableName} SET name = $1, created_by = $2 WHERE id = $3`, [
  //       name,
  //       created_by,
  //       org.id,
  //     ]);
  //     this.logger.log('Successfully updated');
  //   }

  //   async remove(id: number) {
  //     const org = await this.findOne(id);
  //     await this.orgsRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [org.id]);
  //     this.logger.log('Successfully deleted');
  //   }
}
