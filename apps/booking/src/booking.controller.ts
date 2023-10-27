import { Controller, Get, Inject } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SharedService } from '@app/shared';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}
  @MessagePattern({ cmd: 'search-room-for-booking' })
  async searchRoomForBooking(
    @Ctx() context: RmqContext,
    payload: { start: string; end: string },
  ): Promise<any> {
    this.sharedService.acknowledgeMessage(context);
    return this.bookingService.searchRoomForBooking(payload);
  }
}
