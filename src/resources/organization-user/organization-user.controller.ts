import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../user/entity/user.entity';
import { CreateOrganizationUserDto } from './dto/create-organization-user.dto';
import { OrganizationUsersService } from './organization-user.service';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/shared/constants';
import { UserId } from 'src/shared/decorators/user-id.decorator';

@Controller('organizations/:orgId(\\d+)/users')
@ApiTags('Organization Users')
export class OrganizationUsersController {
  constructor(private readonly organizationUsersService: OrganizationUsersService) {}

  @Role(UserRoleEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Creates a user for organization' })
  @ApiResponse({ description: 'Successfull operation', type: User })
  create(
    @UserId() userId: number,
    @Param('orgId') orgId: number,
    @Body() createOrganizationUserDto: CreateOrganizationUserDto,
  ) {
    return this.organizationUsersService.create(userId, orgId, createOrganizationUserDto);
  }

  @Role(UserRoleEnum.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Finds all users of organization' })
  @ApiResponse({ description: 'Successfull operation' })
  findAll(@Param('orgId') orgId: number) {
    return this.organizationUsersService.findAll(orgId);
  }
}
