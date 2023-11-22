import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { FindAllResponse } from 'src/shared/types';
import {
  createDeleteQuery,
  createInsertQuery,
  createSelectAllQuery,
  createSelectWhereQuery,
  createUpdateQuery,
} from './organization.query';

@Injectable()
export class OrganizationService {
  logger = new Logger(OrganizationService.name);

  constructor(@InjectRepository(Organization) private orgsRepository: Repository<Organization>) {}

  async create(userId: number, { name }: CreateOrganizationDto) {
    const { query, queryParams } = createInsertQuery(name, userId);
    const [newOrg] = await this.orgsRepository.query(query, queryParams);
    this.logger.log(`Created successfully`);

    return newOrg;
  }

  async findAll(): Promise<FindAllResponse<Organization>> {
    const [selectQuery, countQuery] = createSelectAllQuery();
    const [items, [count]] = await Promise.all([
      this.orgsRepository.query(selectQuery),
      this.orgsRepository.query(countQuery),
    ]);
    this.logger.log(`Items count: ${count.count}`);

    return { items, count: count.count };
  }

  async findOne(id: number): Promise<Organization> {
    const { query, queryParams } = createSelectWhereQuery(id);
    const [item] = await this.orgsRepository.query(query, queryParams);
    if (!item) {
      this.logger.debug('Item not found', id);
      throw new NotFoundException({ message: `Item with id: ${id} not found` });
    }
    this.logger.log(`Item found`, item);
    return item;
  }

  async update(id: number, { name }: UpdateOrganizationDto) {
    const org = await this.findOne(id);
    const { query, queryParams } = createUpdateQuery(name, org);
    await this.orgsRepository.query(query, queryParams);
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const org = await this.findOne(id);
    const { query, queryParams } = createDeleteQuery(org.id);
    await this.orgsRepository.query(query, queryParams);
    this.logger.log('Successfully deleted');
  }
}
