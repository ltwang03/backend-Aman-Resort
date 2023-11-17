import { HttpStatus, Inject, Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';
import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';
import { UserRepositoryInterface } from '@app/shared/interfaces/user.repository.interface';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

enum Status {
  confirmed = 'Đã xác nhận',
  unConfirmed = 'Chưa xác nhận',
  cancel = 'Đã hủy',
}
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
  async getBookings() {
    try {
      const booking = await this.BookingRepository.findAllWithPopulate(
        {},
        'rooms',
      );
      return booking;
    } catch (e) {
      return e;
    }
  }
  async getBookingsUnconfirm() {
    try {
      const bookings = await this.BookingRepository.findAllWithPopulate(
        {
          status: Status.unConfirmed,
        },
        'rooms',
      );
      return bookings;
    } catch (error) {
      return error;
    }
  }
  async deleteBookingById(id) {
    if (!id) {
      throw new HttpException('Invalid Input', HttpStatus.BAD_REQUEST);
    }
    try {
      const deleteBooking = await this.BookingRepository.softDelete(id);
      return { message: 'Deleted', code: 200 };
    } catch (error) {
      return error;
    }
  }
  async confirmBookingById(id) {
    if (!id) {
      return { error: 'Invalid Input', code: 400 };
    }
    try {
      const confirmBooking = await this.BookingRepository.update(id, {
        status: 'Đã xác nhận',
      });
      return { message: 'Confirmed', code: 200 };
    } catch (error) {
      return error;
    }
  }
  async cancelBookingById(id) {
    if (!id) {
      return { error: 'Invalid Input', code: 400 };
    }
    try {
      const cancelBooking = await this.BookingRepository.update(id, {
        status: 'Hủy',
      });
      return { message: 'Canceled', code: 200 };
    } catch (error) {
      return error;
    }
  }
  async getBookingById(id) {
    if (!id) {
      return { error: 'Invalid Input', code: 400 };
    }
    try {
      const booking = await this.BookingRepository.findOneById(id);
      return { message: 'OK', code: 200, booking };
    } catch (error) {
      return error;
    }
  }
  async editBookingById(payload) {
    const { id, ...others } = payload;
    if (!id) {
      return { error: 'Invalid Input', code: 400 };
    }
    try {
      const update = await this.BookingRepository.update(id, { ...others });
      return { message: 'Edited', code: 200 };
    } catch (error) {
      return error;
    }
  }
}
