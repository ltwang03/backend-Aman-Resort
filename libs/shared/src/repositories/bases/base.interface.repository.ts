import { FindAllResponse } from '@app/shared/repositories/types/common.type';
import { FilterQuery, QueryOptions } from 'mongoose';

export interface BaseInterfaceRepository<T> {
  create(dto: T | any): Promise<T>;
  findOneById(id: string, populate?: string, projection?: string): Promise<T>;

  findOneByCondition(
    condition?: object,
    fieldPopulate_1?: string,
    fieldPopulate_2?: string,
    projection?: string,
  ): Promise<T>;

  findAllWithPopulate(
    condition: object,
    fieldPopulate_1?: string,
    fieldPopulate_2?: string,
    options?: object,
  ): Promise<FindAllResponse<T>>;

  update(id: string, dto): Promise<T>;

  updateList(id: string, dto: Partial<T>): Promise<T>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;
}
