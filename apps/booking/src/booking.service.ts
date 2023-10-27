import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';

import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';

@Injectable()
export class BookingService {
  constructor(
    configService: ConfigService,
    @Inject('RoomRepositoryInterface')
    private readonly RoomRepository: RoomRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly BookingRepository: BookingRepositoryInterface,
  ) {}
  async searchRoomForBooking(payload) {}
}
