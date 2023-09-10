import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Repository } from 'typeorm';
import { Role } from '@core/database/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.repository.create(createRoleDto);
    return this.repository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Role> {
    return this.repository.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Role> {
    return this.repository.findOne({ where: { name } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    const newRole: Role = { ...role, ...updateRoleDto };

    return this.repository.save(newRole);
  }

  async remove(id: string): Promise<Role> {
    const role = await this.findOne(id);

    return this.repository.softRemove(role);
  }
}
