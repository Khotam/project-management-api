import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { FindAllResponse } from 'src/shared/types';

@Injectable()
export class ProjectService {
  logger = new Logger(ProjectService.name);
  tableName = 'projects';

  constructor(@InjectRepository(Project) readonly projectRepository: Repository<Project>) {}
  async create({ created_by, org_id }: CreateProjectDto) {
    const [newProject] = await this.projectRepository.query(
      `INSERT INTO ${this.tableName} (org_id, created_by) VALUES ($1, $2) RETURNING *`,
      [org_id, created_by],
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

  async findOne(id: number): Promise<Project> {
    const [item] = await this.projectRepository.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
    if (!item) {
      this.logger.debug('Item not found', id);
      throw new NotFoundException({ message: `Item with id: ${id} not found` });
    }
    this.logger.log(`Item found`, item);
    return item;
  }

  async update(id: number, { created_by, org_id }: UpdateProjectDto) {
    const project = await this.findOne(id);
    await this.projectRepository.query(`UPDATE ${this.tableName} SET org_id = $1, created_by = $2 WHERE id = $3`, [
      org_id ?? project.org_id,
      created_by ?? project.created_by,
      project.id,
    ]);
    this.logger.log('Successfully updated');
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    await this.projectRepository.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [project.id]);
    this.logger.log('Successfully deleted');
  }
}
