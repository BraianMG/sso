import { DeepPartial } from 'typeorm';
import { IPagination } from './pagination.interface';
import { ISearch } from './search.interface';

export interface ICrudService<T> {
  count(filter?: ISearch): Promise<number>;
  findAll(): Promise<T[]>;
  search(filter?: ISearch): Promise<IPagination<T>>;
  findOne(id: string | number): Promise<T>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: string | number, data: DeepPartial<T>): Promise<T>;
  remove(id: string | number): Promise<T>;
}
