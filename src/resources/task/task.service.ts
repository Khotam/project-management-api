import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/shared/types';
import { TaskStatusEnum } from 'src/shared/constants';
import { FindProjectTasksDto } from '../project/dto/find-project-tasks.dto';

@Injectable()
export class TaskService {
  logger = new Logger(TaskService.name);
  tableName = 'tasks';

  constructor(@InjectRepository(Task) readonly taskRepository: Repository<Task>) {}
  async create({ createdBy, projectId }: CreateTaskDto) {
    const [newTask] = await this.taskRepository.query(
      `INSERT INTO ${this.tableName} (project_id, created_by) VALUES ($1, $2) RETURNING *`,
      [projectId, createdBy],
    );
    this.logger.log('Created successfully');

    return newTask;
  }

  async findAll(): Promise<FindAllResponse<Task>> {
    const itemsPromise = this.taskRepository.query(`SELECT * FROM ${this.tableName}`);
    const countPromise = this.taskRepository.query(`SELECT COUNT(*) FROM ${this.tableName}`);
    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { items, count: count.count };
  }

  async findOne(id: number): Promise<Task> {
    const [item] = await this.taskRepository.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    if (!item) {
      this.logger.debug('Item not found', id);
      throw new NotFoundException({ message: `Item with id: ${id} not found` });
    }
    this.logger.log(`Item found`, item);

    return item;
  }

  async update(id: number, { createdBy, projectId }: UpdateTaskDto) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET project_id = $1, created_by = $2 WHERE id = $3`, [
      projectId ?? task.projectId,
      createdBy ?? task.createdBy,
      task.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [task.id]);
    this.logger.log('Successfully deleted');
  }

  async assignWorker(id: number, workerUserId: number) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET worker_user_id = $1, status = $2 WHERE id = $3`, [
      workerUserId,
      TaskStatusEnum.IN_PROCESS,
      task.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async assignDueDate(id: number, dueDate: Date) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET due_date = $1 WHERE id = $2`, [dueDate, task.id]);
    this.logger.log('Successfully updated');
  }

  async findAllTasksByProject(projectId: number, { status, userId }: FindProjectTasksDto) {
    let whereQuery = `WHERE project_id = $1`;
    const queryParams: (string | number)[] = [projectId];
    if (userId) {
      queryParams.push(userId);
      whereQuery += ` AND worker_user_id = $${queryParams.length}`;
    }
    if (status) {
      queryParams.push(status);
      whereQuery += ` AND status = $${queryParams.length}`;
    }
    const itemsPromise = this.taskRepository.query(`SELECT * FROM ${this.tableName} ${whereQuery}`, queryParams);
    const countPromise = this.taskRepository.query(`SELECT COUNT(*) FROM ${this.tableName} ${whereQuery}`, queryParams);

    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { tasks: items, count: count.count };
  }

  async completeTask(id: number) {
    const task = await this.findOne(id);
    if (!this.isTaskInProcess(task)) {
      throw new BadRequestException('Task is not assigned yet or already done');
    }
    let status = TaskStatusEnum.DONE;
    if (this.isTaskOverdue(task)) {
      status = TaskStatusEnum.DONE_OVERDUE;
    }
    await this.taskRepository.query(`UPDATE ${this.tableName} SET status = $1, done_at=$2 WHERE id = $3`, [
      status,
      new Date(),
      task.id,
    ]);
  }

  private isTaskInProcess(task: Task) {
    return task.status === TaskStatusEnum.IN_PROCESS;
  }

  private isTaskOverdue(task: Task) {
    return new Date() > new Date(task.dueDate);
  }
}
