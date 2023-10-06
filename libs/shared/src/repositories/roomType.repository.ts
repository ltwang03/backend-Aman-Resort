import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@app/shared/repositories/base.abstract.repository';
import { RoomType } from '@app/shared/schemas/roomType.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomTypeRepositoryInterface } from '@app/shared/interfaces/roomType.repository.interface';

@Injectable()
export class RoomTypeRepository
  extends BaseRepositoryAbstract<RoomType>
  implements RoomTypeRepositoryInterface
{
  constructor(
    @InjectModel(RoomType.name)
    private readonly RoomTypeRepository: Model<RoomType>,
  ) {
    super(RoomTypeRepository);
  }
}
