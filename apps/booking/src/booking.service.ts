import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';
import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';
import { UserRepositoryInterface } from '@app/shared/interfaces/user.repository.interface';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

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
    const { start, end, access_token, ...others } = payload;
    if (
      !moment(start, 'DD-MM-YYYY', true).isValid() ||
      !moment(end, 'DD-MM-YYYY', true).isValid()
    ) {
      return { status: 'Định dạng thời gian không hợp lệ', code: 400 };
    }
    if (moment(start, 'DD-MM-YYYY').isAfter(moment(end, 'DD-MM-YYYY'))) {
      return {
        status: 'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc',
        code: 400,
      };
    }
    const formatStartToDate = moment(payload.start, 'DD-MM-YYYY').toDate();
    const formatEndToDate = moment(payload.end, 'DD-MM-YYYY').toDate();
    const decoded_token: any = jwt?.decode(access_token);
    const userID = decoded_token?.user?._id;
    const now = moment();
    if (now.isAfter(formatEndToDate)) {
      return {
        message: 'Thời gian đặt phòng đã qua',
        code: HttpStatus.BAD_REQUEST,
      };
    }
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
