import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from 'src/shared/constants';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Role(UserRoleEnum.ADMIN)
  @Get('/organization/projects-tasks-count')
  getProjectsAndTasksCountByOrganization() {
    return this.statisticsService.getProjectsAndTasksCountByOrganization();
  }

  @Role(UserRoleEnum.ADMIN)
  @Get('/organization/project/tasks-count')
  getTasksCountByOrganizationAndProject() {
    return this.statisticsService.getTasksCountByOrganizationAndProject();
  }

  @Role(UserRoleEnum.ADMIN)
  @Get('/organization/project/task/count')
  getOrganizationsProjectsTasksCount() {
    return this.statisticsService.getOrganizationsProjectsTasksCount();
  }
}
