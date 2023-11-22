import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  NUMBER_OF_PROJECTS_AND_TASKS_BY_ORGANIZATION_QUERY,
  NUMBER_OF_TASKS_AND_PROJECTS_AND_ORGANIZATIONS_QUERY,
  NUMBER_OF_TASKS_BY_ORGANIZATION_AND_PROJECT_QUERY,
} from './statistics.query';

@Injectable()
export class StatisticsService {
  constructor(private dataSource: DataSource) {}

  async getProjectsAndTasksCountByOrganization() {
    return this.dataSource.query(NUMBER_OF_PROJECTS_AND_TASKS_BY_ORGANIZATION_QUERY);
  }

  getTasksCountByOrganizationAndProject() {
    return this.dataSource.query(NUMBER_OF_TASKS_BY_ORGANIZATION_AND_PROJECT_QUERY);
  }

  getOrganizationsProjectsTasksCount() {
    return this.dataSource.query(NUMBER_OF_TASKS_AND_PROJECTS_AND_ORGANIZATIONS_QUERY);
  }
}
