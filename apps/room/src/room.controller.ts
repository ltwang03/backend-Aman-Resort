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
      size: number;
      imageThumbnail: Express.Multer.File[];
      imageCover: Express.Multer.File[];
      roomType: string;
      amenities: string[];
      price: number;
      max_adults: number;
      max_children: number;
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
  @MessagePattern({ cmd: 'delete-room' })
  async deleteRoom(
    @Ctx() context: RmqContext,
    @Payload() payload: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.deleteRoom(payload.id);
  }
  @MessagePattern({ cmd: 'get-amenities' })
  async getAmenities(@Ctx() context) {
    this.sharedService.acknowledgeMessage(context);
    return this.roomService.getAmenities();
  }
}
