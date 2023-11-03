import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';

import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';
const moment = require('moment');

@Injectable()
export class BookingService {
  constructor(
    configService: ConfigService,
    @Inject('RoomRepositoryInterface')
    private readonly RoomRepository: RoomRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly BookingRepository: BookingRepositoryInterface,
  ) {}
  async booking(payload) {
    const formatStartToDate = moment(payload.start, 'DD-MM-YYYY').toDate();
    const formatEndToDate = moment(payload.end, 'DD-MM-YYYY').toDate();
    const { start, end, ...others } = payload;
    try {
      const saveBooking = await this.BookingRepository.create({
        start: formatStartToDate,
        end: formatEndToDate,
        ...others,
      });
      return { status: 'Đặt phòng thành công', code: 200 };
    } catch (e) {
      return e;
    }
  }
}
