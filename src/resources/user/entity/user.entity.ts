import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleEnum } from '../constants/user.constants';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ enum: UserRoleEnum })
  role: UserRoleEnum;

  @Column({ type: 'int' })
  created_by: number;
}
