import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';
import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';
import { UserRepositoryInterface } from '@app/shared/interfaces/user.repository.interface';
import * as jwt from 'jsonwebtoken';
const moment = require('moment');

@Injectable()
export class BookingService {
  constructor(
    configService: ConfigService,
    @Inject('RoomRepositoryInterface')
    private readonly RoomRepository: RoomRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly BookingRepository: BookingRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly UserRepository: UserRepositoryInterface,
  ) {}
  async booking(payload) {
    const formatStartToDate = moment(payload.start, 'DD-MM-YYYY').toDate();
    const formatEndToDate = moment(payload.end, 'DD-MM-YYYY').toDate();
    const { start, end, access_token, ...others } = payload;
    const decoded_token: any = jwt?.decode(access_token);
    const userID = decoded_token?.user?._id;

    try {
      const saveBooking = await this.BookingRepository.create({
        start: formatStartToDate,
        end: formatEndToDate,
        ...others,
      });
      if (userID) {
        const updateBookingForUser = await this.UserRepository.updateList(
          userID,
          { booked: saveBooking },
        );
      }
      return { status: 'Đặt phòng thành công', code: 200 };
    } catch (e) {
      return e;
    }
  }
}
