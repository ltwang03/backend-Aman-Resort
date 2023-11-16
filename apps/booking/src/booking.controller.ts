import { Controller, Get, Inject } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}
  @MessagePattern({ cmd: 'booking' })
  async booking(@Ctx() context: RmqContext, @Payload() payload) {
    this.sharedService.acknowledgeMessage(context);
    return this.bookingService.booking(payload);
  }
  @MessagePattern({ cmd: 'get-all-booking' })
  async getBookings(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.bookingService.getBookings();
  }
  @MessagePattern({ cmd: 'get-all-booking-unconfirm' })
  async getBookingsUnConfirm(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.bookingService.getBookingsUnconfirm();
  }
  @MessagePattern({ cmd: 'delete-booking-by-id' })
  async deleteBookingById(
    @Ctx() context: RmqContext,
    @Payload() payload: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.bookingService.deleteBookingById(payload.id);
  }
}
