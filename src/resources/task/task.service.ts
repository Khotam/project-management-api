import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/shared/types';
import { TaskStatusEnum } from 'src/shared/constants';

@Injectable()
export class TaskService {
  logger = new Logger(TaskService.name);
  tableName = 'tasks';

  constructor(@InjectRepository(Task) readonly taskRepository: Repository<Task>) {}
  async create({ createdBy, projectId, name }: CreateTaskDto) {
    const [newTask] = await this.taskRepository.query(
      `INSERT INTO ${this.tableName} (name, "projectId", "createdBy") VALUES ($1, $2, $3) RETURNING *`,
      [name, projectId, createdBy],
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

  async update(id: number, { createdBy, projectId, name }: UpdateTaskDto) {
    const task = await this.findOne(id);
    await this.taskRepository.query(
      `UPDATE ${this.tableName} SET name = $1, projectId = $2, createdBy = $3 WHERE id = $4`,
      [name ?? task.name, projectId ?? task.projectId, createdBy ?? task.createdBy, task.id],
    );
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [task.id]);
    this.logger.log('Successfully deleted');
  }

  async assignWorker(id: number, workerUserId: number) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET "workerUserId" = $1, status = $2 WHERE id = $3`, [
      workerUserId,
      TaskStatusEnum.IN_PROCESS,
      task.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async assignDueDate(id: number, dueDate: Date) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET "dueDate" = $1 WHERE id = $2`, [dueDate, task.id]);
    this.logger.log('Successfully updated');
  }

  async findAllTasksByProject(projectId: number) {
    const whereQuery = `WHERE "projectId" = $1`;
    const queryParams = [projectId];

    const itemsPromise = this.taskRepository.query(`SELECT * FROM ${this.tableName} ${whereQuery}`, queryParams);
    const countPromise = this.taskRepository.query(`SELECT COUNT(*) FROM ${this.tableName} ${whereQuery}`, queryParams);

    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { tasks: items, count: count.count };
  }

  async findAllTasksByProjectAndUser(projectId: number, userId: number, status?: TaskStatusEnum) {
    let whereQuery = `WHERE "projectId" = $1 AND "userId" = $2`;
    const queryParams: (number | TaskStatusEnum)[] = [projectId, userId];
    if (status) {
      whereQuery += ` AND status = $3`;
      queryParams.push(status);
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
    await this.taskRepository.query(`UPDATE ${this.tableName} SET status = $1, doneAt=$2 WHERE id = $3`, [
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
