import { IsDefined, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsDefined()
  @IsInt()
  project_id: number;

  @IsDefined()
  @IsInt()
  created_by: number;
}
