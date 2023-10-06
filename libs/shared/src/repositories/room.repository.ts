import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@app/shared';
import { Room } from '@app/shared/schemas/room.schema';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoomRepository
  extends BaseRepositoryAbstract<Room>
  implements RoomRepositoryInterface
{
  constructor(
    @InjectModel(Room.name) private readonly RoomRepository: Model<Room>,
  ) {
    super(RoomRepository);
  }
}
