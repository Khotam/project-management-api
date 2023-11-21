import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../user/entity/user.entity';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';
import { OrganizationUsersService } from './organization-user.service';

@Controller('organizations/:orgId(\\d+)/users')
@ApiTags('Organization Users')
export class OrganizationUsersController {
  constructor(private readonly organizationUsersService: OrganizationUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a user for organization' })
  @ApiResponse({ description: 'Successfull operation', type: User })
  create(@Param('orgId') orgId: number, @Body() createOrganizationUserDto: CreateOrganizationUserDto) {
    return this.organizationUsersService.create(orgId, createOrganizationUserDto);
  }

  //   @Get()
  //   @ApiOperation({ summary: 'Gets all organizations' })
  //   @ApiResponse({ type: Organization })
  //   findAll() {
  //     return this.organizationService.findAll();
  //   }

  //   @Get(':id(\\d+)')
  //   findOne(@Param('id') id: string) {
  //     return this.organizationService.findOne(+id);
  //   }

  //   @Put(':id(\\d+)')
  //   update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
  //     return this.organizationService.update(+id, updateOrganizationDto);
  //   }

  //   @Delete(':id(\\d+)')
  //   remove(@Param('id') id: string) {
  //     return this.organizationService.remove(+id);
  //   }
}
