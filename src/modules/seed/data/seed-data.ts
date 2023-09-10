import { Role } from '@core/database/entities/role.entity';
import { User } from '@core/database/entities/user.entity';
import * as bcrypt from 'bcrypt';

interface SeedData {
  roles: Role[];
  users: User[];
}

const adminRole = { name: 'ADMIN' };
const userRole = { name: 'USER' };

export const initialData: SeedData = {
  roles: [adminRole, userRole],
  users: [
    {
      email: 'admin1@example.com',
      fullName: 'Administrador 1',
      password: bcrypt.hashSync('Admin1', 10),
      isActive: true,
      roles: [adminRole],
    },
    {
      email: 'user1@example.com',
      fullName: 'Usuario 1',
      password: bcrypt.hashSync('User1', 10),
      isActive: true,
      roles: [userRole],
    },
    {
      email: 'user2@example.com',
      fullName: 'Superuser 1',
      password: bcrypt.hashSync('User2', 10),
      isActive: true,
      roles: [userRole],
    },
  ],
};

// import * as bcrypt from 'bcrypt';

// interface SeedData {
//   roles: string[];
//   users: UserData[];
// }

// interface UserData {
//   email: string;
//   fullName: string;
//   password: string;
// }

// export const initialData: SeedData = {
//   roles: ['ADMIN', 'USER'],
//   users: [
//     {
//       email: 'admin1@example.com',
//       fullName: 'Administrador 1',
//       password: bcrypt.hashSync('Admin1', 10),
//     },
//     {
//       email: 'user1@example.com',
//       fullName: 'Usuario 1',
//       password: bcrypt.hashSync('User1', 10),
//     },
//     {
//       email: 'user2@example.com',
//       fullName: 'Superuser 1',
//       password: bcrypt.hashSync('User2', 10),
//     },
//   ],
// };
