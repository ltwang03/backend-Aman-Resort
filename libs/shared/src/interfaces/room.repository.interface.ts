import { Room } from '@app/shared/schemas/room.schema';
import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';

export interface RoomRepositoryInterface
  extends BaseInterfaceRepository<Room> {}
