import { BaseEntity } from './base.entity';
import { RolesEnum } from '../../enums';
import { Column, Entity } from 'typeorm';

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

  @Column({
    type: 'simple-array',
    default: [RolesEnum.User],
  })
  roles: RolesEnum[];
}
