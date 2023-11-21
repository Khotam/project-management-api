import { IsDefined, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsInt()
  orgId: number;

  @IsDefined()
  @IsInt()
  createdBy: number;
}
