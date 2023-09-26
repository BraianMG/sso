import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '@core/database/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@core/crud';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    protected readonly repository: Repository<Role>,
  ) {
    super(repository);
  }

  async findOneByName(name: string): Promise<Role> {
    return this.repository.findOne({ where: { name } });
  }
}
