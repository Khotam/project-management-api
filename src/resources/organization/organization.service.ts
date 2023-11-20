import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  logger = new Logger(OrganizationService.name);

  constructor(@InjectRepository(Organization) private orgsRepository: Repository<Organization>) {}

  async create({ created_by, name }: CreateOrganizationDto) {
    const newOrg = await this.orgsRepository.query(`INSERT INTO organizations (name, created_by) VALUES ($1, $2)`, [
      name,
      created_by,
    ]);
    console.log('newOrg :>> ', newOrg);
    this.logger.log(`Item created`);

    return newOrg;
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    console.log('updateOrganizationDto :>> ', updateOrganizationDto);
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
