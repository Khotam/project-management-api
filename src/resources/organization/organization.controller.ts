import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/shared/constants';

@Controller('organizations')
@ApiTags('Organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Role(UserRoleEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Creates an organization' })
  @ApiResponse({ description: 'Successfull operation', type: Organization })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Role(UserRoleEnum.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Gets all organizations' })
  @ApiResponse({ type: Organization })
  findAll() {
    return this.organizationService.findAll();
  }

  @Role(UserRoleEnum.ADMIN)
  @Get(':id(\\d+)')
  findOne(@Param('id') id: number) {
    return this.organizationService.findOne(id);
  }

  @Role(UserRoleEnum.ADMIN)
  @Put(':id(\\d+)')
  update(@Param('id') id: number, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Role(UserRoleEnum.ADMIN)
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.organizationService.remove(id);
  }
}
