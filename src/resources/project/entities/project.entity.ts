import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  org_id: number;

  @Column({ type: 'int' })
  created_by: number;
}
