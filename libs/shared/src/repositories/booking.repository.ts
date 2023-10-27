import { BaseRepositoryAbstract } from '@app/shared';
import { Booking } from '@app/shared/schemas/booking.schema';
import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
@Injectable()
export class BookingRepository
  extends BaseRepositoryAbstract<Booking>
  implements BookingRepositoryInterface
{
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingRepository: Model<Booking>,
  ) {
    super(bookingRepository);
  }
}
