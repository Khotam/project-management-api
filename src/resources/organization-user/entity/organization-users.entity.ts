import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'organization_users' })
export class OrganizationUsers {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  orgId: string;

  @Column({ type: 'int' })
  userId: number;
}
