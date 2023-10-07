import { BaseEntity } from './base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  resetPasswordToken?: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
