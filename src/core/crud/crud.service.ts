import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICrudService } from './crudService.interface';
import IPagination from './pagination.interface';
import ISearch from './search.interface';
import { BaseEntity } from '@core/database/entities/base.entity';
import { OrderDirection } from './enums';

@Injectable()
export abstract class BaseService<T extends BaseEntity>
  implements ICrudService<T>
{
  protected constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const obj: DeepPartial<T> = JSON.parse(JSON.stringify(data));
    const entity = this.repository.create(obj);

    try {
      return await this.repository.save(entity);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async search(filter?: ISearch): Promise<IPagination<T>> {
    const options: FindManyOptions = this.getFindManyOptions(filter);

    const [items, total] = await this.repository.findAndCount(options);
    return { items, total };
  }

  async findOne(id: string | number): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id },
    } as FindOneOptions<T>);

    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }

    return entity;
  }

  async count(filter?: ISearch): Promise<number> {
    const options: FindManyOptions = this.getFindManyOptions(filter);

    return await this.repository.count(options);
  }

  async update(id: string | number, data: DeepPartial<T>): Promise<T> {
    try {
      const currEntity = await this.findOne(id);
      const obj: DeepPartial<T> = JSON.parse(JSON.stringify(data));
      const newEntity = { ...currEntity, ...obj };
      await this.repository.save(newEntity);
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string | number): Promise<T> {
    const entity = await this.findOne(id);
    return await this.repository.softRemove(entity);
  }

  private getEntityName(): string {
    return this.repository.metadata.name;
  }

  private getFindManyOptions(filter?: ISearch) {
    const options: FindManyOptions = {};

    if (filter.take) {
      options.skip = filter.skip;
      options.take = filter.take;
    }

    if (filter.orderBy) {
      const fields = filter.orderBy.split(',');
      const directions = filter.orderDirection.split(',');

      if (fields.length) {
        options.order = {};
      }

      fields.forEach((field, i) => {
        if (!options.order[field]) {
          const direction = directions[i]?.toUpperCase();
          if (
            Object.values(OrderDirection).includes(direction as OrderDirection)
          ) {
            options.order[field] = direction;
          } else {
            options.order[field] = OrderDirection.ASC;
          }
        }
      });
    }

    if (filter.relations) {
      options.relations = filter.relations;
    }

    if (filter.where) {
      options.where = filter.where;
    }

    return options;
  }
}
