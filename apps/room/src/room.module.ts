import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ConfigModule } from '@nestjs/config';
import {
  AmenityRepository,
  MongodbModule,
  RoomRepository,
  RoomTypeRepository,
  SharedModule,
  SharedService,
  StorageModule,
  StorageService,
} from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from '@app/shared/schemas/room.schema';
import { RoomType, RoomTypeSchema } from '@app/shared/schemas/roomType.schema';
import { Amenity, AmenitySchema } from '@app/shared/schemas/amenity.schema';
import { BookingRepository } from '@app/shared/repositories/booking.repository';
import { Booking, BookingSchema } from '@app/shared/schemas/booking.schema';
import moment from 'moment';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
    }),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    MongodbModule,
    StorageModule,
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: RoomType.name, schema: RoomTypeSchema },
      { name: Amenity.name, schema: AmenitySchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    { provide: 'SharedServiceInterface', useClass: SharedService },
    { provide: 'RoomRepositoryInterface', useClass: RoomRepository },
    { provide: 'RoomTypeRepositoryInterface', useClass: RoomTypeRepository },
    { provide: 'AmenityRepositoryInterface', useClass: AmenityRepository },
    { provide: 'BookingRepositoryInterface', useClass: BookingRepository },
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
})
export class RoomModule {}
