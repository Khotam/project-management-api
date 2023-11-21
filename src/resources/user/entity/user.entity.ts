import { UserRoleEnum } from 'src/shared/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ enum: UserRoleEnum })
  role: UserRoleEnum;

  @Column({ type: 'int' })
  createdBy: number;
}
