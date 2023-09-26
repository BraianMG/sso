import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User } from '@core/database/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '@modules/roles/roles.service';
import { BaseService } from '@core/crud';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {
    super(repository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const defaultRole = await this.rolesService.findOneByName('USER');
    const user = this.repository.create({
      ...createUserDto,
      roles: [defaultRole],
    });

    return this.repository.save(user);
  }

  async findOneWithOptions(options: FindOneOptions<User>): Promise<User> {
    return this.repository.findOne(options);
  }
}
