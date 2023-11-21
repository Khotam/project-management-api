import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'organization_users' })
export class OrganizationUsers {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  org_id: string;

  @Column({ type: 'int' })
  user_id: number;
}
