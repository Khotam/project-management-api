import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsInt()
  orgId: number;
}
