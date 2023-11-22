import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/shared/types';
import { TaskService } from '../task/task.service';
import { TaskStatusEnum } from 'src/shared/constants';

@Injectable()
export class ProjectService {
  logger = new Logger(ProjectService.name);
  tableName = 'projects';

  constructor(
    @InjectRepository(Project) readonly projectRepository: Repository<Project>,
    readonly taskService: TaskService,
  ) {}
  async create({ createdBy, orgId, name }: CreateProjectDto) {
    const [newProject] = await this.projectRepository.query(
      `INSERT INTO ${this.tableName} (name, "orgId", "createdBy") VALUES ($1, $2, $3) RETURNING *`,
      [name, orgId, createdBy],
    );
    this.logger.log('Created successfully');

    return newProject;
  }

  async findAll(): Promise<FindAllResponse<Project>> {
    const itemsPromise = this.projectRepository.query(`SELECT * FROM ${this.tableName}`);
    const countPromise = this.projectRepository.query(`SELECT COUNT(*) FROM ${this.tableName}`);
    const [items, [count]] = await Promise.all([itemsPromise, countPromise]);
    this.logger.log(`Items count: ${count.count}`);

    return { items, count: count.count };
  }

  async findAllTasks(projectId: number) {
    return this.taskService.findAllTasksByProject(projectId);
  }

  async findAllTasksForUser(projectId: number, userId: number, status?: TaskStatusEnum) {
    return this.taskService.findAllTasksByProjectAndUser(projectId, userId, status);
  }

  async findOne(id: number): Promise<Project> {
    const [item] = await this.projectRepository.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    if (!item) {
      this.logger.debug('Item not found', id);
      throw new NotFoundException({ message: `Item with id: ${id} not found` });
    }
    this.logger.log(`Item found`, item);
    return item;
  }

  async update(id: number, { createdBy, orgId, name }: UpdateProjectDto) {
    const project = await this.findOne(id);
    await this.projectRepository.query(
      `UPDATE ${this.tableName} SET name = $1, orgId = $2, createdBy = $3 WHERE id = $4`,
      [name ?? project.name, orgId ?? project.orgId, createdBy ?? project.createdBy, project.id],
    );
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    await this.projectRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [project.id]);
    this.logger.log('Successfully deleted');
  }
}
