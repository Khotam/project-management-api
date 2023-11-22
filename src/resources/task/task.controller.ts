import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/shared/constants';

@Controller('tasks')
@ApiTags('Tasks')
@Role(UserRoleEnum.MANAGER)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id(\\d+)')
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id(\\d+)')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id(\\d+)/assign-worker')
  setWorker(@Param('id') id: number, @Body('workerUserId') workerUserId: number) {
    return this.taskService.assignWorker(id, workerUserId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id(\\d+)/assign-due-date')
  setDueDate(@Param('id') id: number, @Body('dueDate') dueDate: Date) {
    return this.taskService.assignDueDate(id, dueDate);
  }

  @Role(UserRoleEnum.EMPLOYEE)
  @Post(':id(\\d+)/complete')
  completeTask(@Param('id') id: number) {
    return this.taskService.completeTask(id);
  }
}
