import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}
