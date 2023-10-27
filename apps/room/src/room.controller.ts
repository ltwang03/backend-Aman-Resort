import { Controller, Inject } from '@nestjs/common';
import { RoomService } from './room.service';
import { SharedService } from '@app/shared';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}
  @MessagePattern({ cmd: 'create-amenity' })
  async createAmenity(
    @Payload() payload: { name: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.createAmenity(payload.name);
  }
  @MessagePattern({ cmd: 'create-room-type' })
  async createRoomType(
    @Payload()
    payload: {
      title: string;
      name: string;
      description: string;
      path: string;
      inclusion: string[];
    },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.createRoomType(payload);
  }
  @MessagePattern({ cmd: 'create-new-room' })
  async createRoom(
    @Payload()
    payload: {
      name: string;
      description: string;
      size: string;
      imageThumbnail: Express.Multer.File[];
      imageCover: Express.Multer.File[];
      roomType: string;
      amenities: string[];
      price: string;
      max_adults: string;
      max_children: string;
    },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.createRoom(payload);
  }
  @MessagePattern({ cmd: 'get-rooms' })
  async getAllRooms(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.getAllRooms();
  }
  @MessagePattern({ cmd: 'get-room-type' })
  async getRoomType(
    @Payload() payload: { path: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.getRoomType(payload.path);
  }
  @MessagePattern({ cmd: 'get-room-by-slug' })
  async getRoomBySlug(
    @Payload() payload: { path: string; slug: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.getRoomBySlug(payload.path, payload.slug);
  }
  @MessagePattern({ cmd: 'get-all-room-types' })
  async getAllRoomTypes(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.getAllRoomTypes();
  }
  @MessagePattern({ cmd: 'search-room-for-booking' })
  async SearchRoomForBooking(
    @Ctx() context: RmqContext,
    @Payload()
    payload: { start: string; end: string; adults: string; children: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.SearchRoomForBooking(payload);
  }
}
