import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { TaskStatusEnum, UserRoleEnum } from 'src/shared/constants';
import { UserId } from 'src/shared/decorators/user-id.decorator';

@Controller('projects')
@ApiTags('Projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Role(UserRoleEnum.MANAGER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@UserId() userId: number, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(userId, createProjectDto);
  }

  @Role(UserRoleEnum.MANAGER)
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Role(UserRoleEnum.MANAGER)
  @Get(':projectId(\\d+)/tasks')
  findAllTasks(@Param('projectId') projectId: number) {
    return this.projectService.findAllTasks(projectId);
  }

  @Role(UserRoleEnum.EMPLOYEE)
  @Get(':projectId(\\d+)/user/tasks')
  findAllTasksForUser(
    @UserId() userId: number,
    @Param('projectId') projectId: number,
    @Query() status?: TaskStatusEnum,
  ) {
    return this.projectService.findAllTasksForUser(userId, projectId, status);
  }

  @Role(UserRoleEnum.MANAGER)
  @Get(':id(\\d+)')
  findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Role(UserRoleEnum.MANAGER)
  @Put(':id(\\d+)')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Role(UserRoleEnum.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}
