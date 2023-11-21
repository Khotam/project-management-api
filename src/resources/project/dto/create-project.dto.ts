import { IsDefined, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsInt()
  org_id: number;

  @IsDefined()
  @IsInt()
  created_by: number;
}
