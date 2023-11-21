import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindProjectTasksDto } from './dto/find-project-tasks.dto';

@Controller('projects')
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
  findAllTasks(@Param('projectId') projectId: number, @Query() findProjectTasksDto?: FindProjectTasksDto) {
    return this.projectService.findAllTasks(projectId, findProjectTasksDto);
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
