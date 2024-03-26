import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ConfigModule } from '@nestjs/config';
import {
  MongodbModule,
  RoomRepository,
  SharedModule,
  SharedService,
  UserRepository,
} from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from '@app/shared/schemas/room.schema';
import { Booking, BookingSchema } from '@app/shared/schemas/booking.schema';
import { BookingRepository } from '@app/shared/repositories/booking.repository';
import { User, UserSchema } from '@app/shared/schemas/user.schema';
import { VNpayModule } from './vnpay/vnpay.module';
import { VnpayService } from './vnpay/vnpay.service';
import { TransactionRepository } from '@app/shared/repositories/transaction.repository';
import {
  Transaction,
  TransactionSchema,
} from '@app/shared/schemas/transaction.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './.env' }),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    VNpayModule.forRoot({
      vnpayHost: 'https://sandbox.vnpayment.vn',
      secureSecret: 'NIXEWBOLCUWMEPOJKTEBSYRSXZKRNJXY',
      tmnCode: 'F20I0Q8E',
    }),
    MongodbModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    VnpayService,
    { provide: 'SharedServiceInterface', useClass: SharedService },
    { provide: 'RoomRepositoryInterface', useClass: RoomRepository },
    { provide: 'BookingRepositoryInterface', useClass: BookingRepository },
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
    {
      provide: 'TransactionRepositoryInterface',
      useClass: TransactionRepository,
    },
  ],
})
export class BookingModule {}
