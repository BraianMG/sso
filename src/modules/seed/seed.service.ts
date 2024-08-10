import { Role } from '@core/database/entities/role.entity';
import { User } from '@core/database/entities/user.entity';
import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEnvironmentMatch } from '@shared/functions';
import { Repository } from 'typeorm';
import { initialData } from './data/seedData';
import { ENVIRONMENT } from '@shared/enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async runSeed() {
    if (!isEnvironmentMatch(ENVIRONMENT.Development)) {
      throw new MethodNotAllowedException();
    }

    await this.deleteTables();
    const roles = await this.insertRoles();
    await this.insertUsers(roles);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.userRepository.delete({});
    await this.roleRepository.delete({});
  }

  private async insertRoles(): Promise<Role[]> {
    const seedRoles = initialData.roles;
    const roles: Role[] = [];

    seedRoles.forEach((role) => roles.push(this.roleRepository.create(role)));

    return await this.roleRepository.save(roles);
  }

  private async insertUsers(roles: Role[]): Promise<User[]> {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      const { roles: userRoles, ...userData } = user;

      users.push(
        this.userRepository.create({
          ...userData,
          roles: roles.filter((role) =>
            userRoles.some((ur) => ur.name === role.name),
          ),
        }),
      );
    });

    return await this.userRepository.save(users);
  }
}
