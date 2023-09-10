import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from '@core/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '@modules/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const defaultRole = await this.rolesService.findOneByName('USER');
    const user = this.repository.create({
      ...createUserDto,
      roles: [defaultRole],
    });
    return this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const newUser: User = { ...user, ...updateUserDto };

    return this.repository.save(newUser);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);

    return this.repository.softRemove(user);
  }
}
