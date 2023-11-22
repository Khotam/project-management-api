import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../user/entity/user.entity';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';
import { OrganizationUsersService } from './organization-user.service';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/shared/constants';

@Controller('organizations/:orgId(\\d+)/users')
@ApiTags('Organization Users')
@Role(UserRoleEnum.ADMIN)
export class OrganizationUsersController {
  constructor(private readonly organizationUsersService: OrganizationUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a user for organization' })
  @ApiResponse({ description: 'Successfull operation', type: User })
  create(@Param('orgId') orgId: number, @Body() createOrganizationUserDto: CreateOrganizationUserDto) {
    return this.organizationUsersService.create(orgId, createOrganizationUserDto);
  }
}
