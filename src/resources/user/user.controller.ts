import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/shared/constants';
import { Role } from '../auth/decorators/roles.decorator';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
@Role(UserRoleEnum.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id(\\d+)')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id(\\d+)')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: number, @Body('name') name: string) {
    return this.userService.update(id, name);
  }
}
