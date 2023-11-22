import { IsDefined, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRoleEnum } from 'src/shared/constants';

export class CreateOrganizationUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(UserRoleEnum)
  @IsDefined()
  role: UserRoleEnum;
}
