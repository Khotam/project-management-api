import { TaskStatusEnum } from 'src/shared/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'int' })
  created_by: number;

  @Column({ type: 'int' })
  worker_user_id: number;

  @Column({ enum: TaskStatusEnum, default: TaskStatusEnum.DONE })
  status: TaskStatusEnum;

  @Column({ type: 'timestamptz' })
  due_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  done_at?: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
