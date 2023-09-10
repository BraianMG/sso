import { Role } from '@core/database/entities/role.entity';
import { User } from '@core/database/entities/user.entity';
import { RolesEnum } from '@modules/auth/enums';
import * as bcrypt from 'bcrypt';

interface SeedData {
  roles: Role[];
  users: User[];
}

const SALT_OR_ROUNDS = Number(process.env.BCRYPT_SALTORROUNDS);

const adminRole = { name: RolesEnum.Admin };
const userRole = { name: RolesEnum.User };

export const initialData: SeedData = {
  roles: [adminRole, userRole],
  users: [
    {
      email: 'admin1@example.com',
      fullName: 'Administrador 1',
      password: bcrypt.hashSync('Admin1', SALT_OR_ROUNDS),
      isActive: true,
      roles: [adminRole],
    },
    {
      email: 'user1@example.com',
      fullName: 'Usuario 1',
      password: bcrypt.hashSync('User1', SALT_OR_ROUNDS),
      isActive: true,
      roles: [userRole],
    },
    {
      email: 'user2@example.com',
      fullName: 'Usuario 2',
      password: bcrypt.hashSync('User2', SALT_OR_ROUNDS),
      isActive: true,
      roles: [userRole],
    },
  ],
};
