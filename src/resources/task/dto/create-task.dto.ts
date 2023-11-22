import { IsDefined, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsInt()
  projectId: number;
}
