import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  async create({ created_by, project_id }: CreateTaskDto) {
    const [newTask] = await this.taskRepository.query(
      `INSERT INTO ${this.tableName} (project_id, created_by) VALUES ($1, $2) RETURNING *`,
      [project_id, created_by],
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

  async update(id: number, { created_by, project_id }: UpdateTaskDto) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET project_id = $1, created_by = $2 WHERE id = $3`, [
      project_id ?? task.project_id,
      created_by ?? task.created_by,
      task.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [task.id]);
    this.logger.log('Successfully deleted');
  }

  async assignWorker(id: number, worker_user_id: number) {
    console.log('worker_user_id :>> ', worker_user_id);
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET worker_user_id = $1, status = $2 WHERE id = $3`, [
      worker_user_id,
      TaskStatusEnum.IN_PROCESS,
      task.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async assignDueDate(id: number, due_date: Date) {
    const task = await this.findOne(id);
    await this.taskRepository.query(`UPDATE ${this.tableName} SET due_date = $1 WHERE id = $2`, [due_date, task.id]);
    this.logger.log('Successfully updated');
  }

  async findAllTasksByProject(project_id: number) {
    const itemsPromise = this.taskRepository.query(`SELECT * FROM ${this.tableName} WHERE project_id = $1`, [
      project_id,
    ]);
    const countPromise = this.taskRepository.query(`SELECT COUNT(*) FROM ${this.tableName} WHERE project_id = $1`, [
      project_id,
    ]);

    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { tasks: items, count: count.count };
  }
}
