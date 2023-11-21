import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { FindAllResponse } from 'src/shared/types';

@Injectable()
export class OrganizationService {
  logger = new Logger(OrganizationService.name);
  tableName = 'organizations';

  constructor(@InjectRepository(Organization) private orgsRepository: Repository<Organization>) {}

  async create({ created_by, name }: CreateOrganizationDto) {
    const [newOrg] = await this.orgsRepository.query(
      `INSERT INTO ${this.tableName} (name, created_by) VALUES ($1, $2) RETURNING *`,
      [name, created_by],
    );
    this.logger.log(`Created successfully`);

    return newOrg;
  }

  async findAll(): Promise<FindAllResponse<Organization>> {
    const itemsPromise = this.orgsRepository.query(`SELECT * FROM ${this.tableName}`);
    const countPromise = this.orgsRepository.query(`SELECT COUNT(*) FROM ${this.tableName}`);
    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { items, count: count.count };
  }

  async findOne(id: number): Promise<Organization> {
    const [item] = await this.orgsRepository.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    if (!item) {
      this.logger.debug('Item not found', id);
      throw new NotFoundException({ message: `Item with id: ${id} not found` });
    }
    this.logger.log(`Item found`, item);
    return item;
  }

  async update(id: number, { created_by, name }: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    await this.orgsRepository.query(`UPDATE ${this.tableName} SET name = $1, created_by = $2 WHERE id = $3`, [
      name ?? org.name,
      created_by ?? org.created_by,
      org.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const org = await this.findOne(id);
    await this.orgsRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [org.id]);
    this.logger.log('Successfully deleted');
  }
}
