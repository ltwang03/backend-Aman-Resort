import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ClientProxy } from '@nestjs/microservices';
import { NewUserDto } from './dtos/new-user.dto';
import { ExistingUserDto } from './dtos/existing-user.dto';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Auth_rGuard } from '@app/shared/guards/auth_r.guard';
import { Request } from 'express';
import { Roles } from '@app/shared/decorators/roles.decorator';
import { Role } from '@app/shared/decorators/role.enum';
import { NewAmenityDto } from './dtos/new-amenity.dto';
import { NewRoomTypeDto } from './dtos/new-RoomType.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { NewRoomDto } from './dtos/new-room.dto';
import { BookingDto } from './dtos/booking.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('ROOM_SERVICE') private readonly roomService: ClientProxy,
    @Inject('BOOKING_SERVICE') private readonly bookingService: ClientProxy,
  ) {}

  @Post('auth/register')
  async register(@Body() newUser: NewUserDto) {
    const { firstname, lastname, phone, country, email, password } = newUser;
    return this.authService.send(
      { cmd: 'register' },
      { firstname, lastname, phone, country, email, password },
    );
  }
  @Post('auth/login')
  async login(@Body() existingUser: ExistingUserDto) {
    const { email, password } = existingUser;
    return this.authService.send({ cmd: 'login' }, { email, password });
  }

  @UseGuards(Auth_rGuard)
  @Get('auth/refresh')
  async refresh(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.authService.send({ cmd: 'refresh' }, { token });
  }
  @UseGuards(AuthGuard)
  @Get('auth/me')
  async getMe(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.authService.send({ cmd: 'me' }, { token });
  }

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('auth/users')
  async getAllUsers() {
    return this.authService.send({ cmd: 'get-all-users' }, {});
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post('room/amenities')
  async createAmenity(@Body() newAmenityDto: NewAmenityDto) {
    const { name } = newAmenityDto;
    return this.roomService.send({ cmd: 'create-amenity' }, { name });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post('room/room-types')
  async createRoomType(@Body() newRoomTypeDto: NewRoomTypeDto) {
    const { title, name, path, description, inclusion } = newRoomTypeDto;
    return this.roomService.send(
      { cmd: 'create-room-type' },
      { title, name, path, description, inclusion },
    );
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post('rooms')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageThumbnail', maxCount: 10 },
      { name: 'imageCover', maxCount: 2 },
    ]),
  )
  async createRoom(
    @UploadedFiles()
    files: {
      imageThumbnail?: Express.Multer.File[];
      imageCover?: Express.Multer.File[];
    },
    @Body() newRoomDto: NewRoomDto,
  ) {
    const {
      name,
      description,
      size,
      roomType,
      amenities,
      price,
      max_adults,
      max_children,
    } = newRoomDto;
    return this.roomService.send(
      { cmd: 'create-new-room' },
      {
        name,
        description,
        size,
        imageThumbnail: files.imageThumbnail,
        imageCover: files.imageCover,
        roomType,
        amenities,
        price,
        max_adults,
        max_children,
      },
    );
  }
  @Get('rooms')
  async getAllRooms() {
    return this.roomService.send({ cmd: 'get-rooms' }, {});
  }
  @Get('rooms/:path')
  async getRoomType(@Param() params: any) {
    const path = params.path;
    return this.roomService.send({ cmd: 'get-room-type' }, { path });
  }
  @Get('rooms/:path/:slug')
  async getRoomBySlug(@Param() params: any) {
    const { path, slug } = params;
    return this.roomService.send({ cmd: 'get-room-by-slug' }, { path, slug });
  }
  @Get('room-types/all')
  async getAllRoomTypes() {
    return this.roomService.send({ cmd: 'get-all-room-types' }, {});
  }
  @Post('rooms/booking/search')
  async searchRoomForBooking(
    @Query()
    query: {
      start: string;
      end: string;
      adults?: string;
      children?: string;
    },
  ) {
    return this.roomService.send(
      { cmd: 'search-room-for-booking' },
      {
        start: query.start,
        end: query.end,
        adults: query.adults,
        children: query.children,
      },
    );
  }
  @Post('bookings')
  async booking(@Body() bookingDto: BookingDto, @Req() req: Request) {
    const {
      firstName,
      lastName,
      phone,
      email,
      country,
      address,
      city,
      zipCode,
      note,
      start,
      end,
      adults,
      children,
      fee,
      totalPrice,
      rooms,
    } = bookingDto;
    const access_token = req?.headers?.authorization.split(' ')[1];
    return this.bookingService.send(
      { cmd: 'booking' },
      {
        firstName,
        lastName,
        phone,
        email,
        country,
        address,
        city,
        zipCode,
        note,
        start,
        end,
        adults,
        children,
        fee,
        totalPrice,
        rooms,
        access_token,
      },
    );
  }
}
