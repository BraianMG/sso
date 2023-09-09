import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity('role')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;
}
