import { IsDefined, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsDefined()
  @IsInt()
  projectId: number;

  @IsDefined()
  @IsInt()
  createdBy: number;
}
