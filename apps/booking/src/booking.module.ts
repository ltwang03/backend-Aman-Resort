import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ConfigModule } from '@nestjs/config';
import {
  MongodbModule,
  RoomRepository,
  SharedModule,
  SharedService,
} from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from '@app/shared/schemas/room.schema';
import { Booking, BookingSchema } from '@app/shared/schemas/booking.schema';
import { BookingRepository } from '@app/shared/repositories/booking.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './.env' }),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    MongodbModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    { provide: 'SharedServiceInterface', useClass: SharedService },
    { provide: 'RoomRepositoryInterface', useClass: RoomRepository },
    { provide: 'BookingRepositoryInterface', useClass: BookingRepository },
  ],
})
export class BookingModule {}
