import { IsDefined, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateOrganizationDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsInt()
  created_by: number;
}
