import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import { FilterQuery, Model, Query, QueryOptions } from 'mongoose';
import { FindAllResponse } from '@app/shared/repositories/types/common.type';
import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';
import { Room, RoomDocument } from '@app/shared/schemas/room.schema';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseInterfaceRepository<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    return await this.model.create(dto);
  }

  async findOneById(id: string, populated?: string): Promise<T> {
    const item: any = await this.model.findById(id)?.populate(populated).exec();
    return item.delete_at ? null : item;
  }

  async findOneByCondition(
    condition = {},
    fieldPopulate_1?: string,
    fieldPopulate_2?: string,
  ): Promise<any> {
    return await this.model
      .findOne({
        ...condition,
        delete_at: null,
      })
      ?.populate(fieldPopulate_1)
      ?.populate(fieldPopulate_2)
      .exec();
  }

  async findAllWithPopulate(
    condition: FilterQuery<T>,
    fieldPopulate_1?: string,
    fieldPopulate_2?: string,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const [count, items] = await Promise.all([
      this.model.countDocuments({ ...condition, delete_at: null }),
      this.model
        .find({ ...condition, delete_at: null }, options?.projection, options)
        ?.populate(fieldPopulate_1)
        ?.populate(fieldPopulate_2)
        .exec(),
    ]);
    return { count, items };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    const updatedData = await this.model.findOneAndUpdate(
      { _id: id, delete_at: null },
      dto,
      { new: true },
    );
    return updatedData;
  }
  async updateList(id: string, dto: Partial<T>): Promise<T> {
    const updateData = await this.model.findByIdAndUpdate(
      { _id: id, delete_at: null },
      { $push: dto },
      { new: true, omitUndefined: true },
    );
    return updateData;
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, { delete_at: new Date() })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
