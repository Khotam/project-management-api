import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { TaskStatusEnum, UserRoleEnum } from 'src/shared/constants';

@Controller('projects')
@ApiTags('Projects')
@Role(UserRoleEnum.MANAGER)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':projectId(\\d+)/tasks')
  findAllTasks(@Param('projectId') projectId: number) {
    return this.projectService.findAllTasks(projectId);
  }

  @Role(UserRoleEnum.EMPLOYEE)
  @Get(':projectId(\\d+)/user/:userId(\\d+)/tasks')
  findAllTasksForUser(@Param() { projectId, userId }: Record<string, number>, @Query() status?: TaskStatusEnum) {
    return this.projectService.findAllTasksForUser(projectId, userId, status);
  }

  @Get(':id(\\d+)')
  findOne(@Param('id') id: number) {
    return this.projectService.findOne(id);
  }

  @Put(':id(\\d+)')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}
