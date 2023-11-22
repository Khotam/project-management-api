import { TaskStatusEnum } from 'src/shared/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'int' })
  projectId: number;

  @Column({ type: 'int' })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  workerUserId?: number;

  @Column({ enum: TaskStatusEnum, default: TaskStatusEnum.DONE })
  status: TaskStatusEnum;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  doneAt?: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
