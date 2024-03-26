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
  Delete,
  Patch,
  Put,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ClientProxy } from '@nestjs/microservices';
import { NewUserDto } from './dtos/new-user.dto';
import { ExistingUserDto } from './dtos/existing-user.dto';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Auth_rGuard } from '@app/shared/guards/auth_r.guard';
import { Request, Response } from 'express';
import { Roles } from '@app/shared/decorators/roles.decorator';
import { Role } from '@app/shared/decorators/role.enum';
import { NewAmenityDto } from './dtos/new-amenity.dto';
import { NewRoomTypeDto } from './dtos/new-RoomType.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { NewRoomDto } from './dtos/new-room.dto';
import { BookingDto } from './dtos/booking.dto';
import { AddUserFromAdminDto } from './dtos/add-user-from-admin.dto';
import { EditUserDto } from './dtos/edt-user.dto';
import { EditMeDto } from './dtos/edit-me.dto';
import { EditBookingDto } from './dtos/edit-booking.dto';
import { FacebookGuard } from './guards/facebook.guard';
import { GoogleGuard } from './guards/google.guard';
import { CreateUrlVNpayDto } from './dtos/create-url-vnpay.dto';

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

  @Post('auth/login/v2')
  async loginV2(@Body() existingUser: ExistingUserDto) {
    const { email, password } = existingUser;
    return this.authService.send({ cmd: 'login-v2' }, { email, password });
  }

  @Post('auth/verify/2fa')
  async verify2fa(@Body() body: any) {
    const { otp } = body;
    return this.authService.send({ cmd: 'verify-otp' }, { otp });
  }

  @Get('auth/facebook')
  @UseGuards(FacebookGuard)
  async facebookLogin() {
    return this.authService.send({ cmd: 'facebook' }, {});
  }

  @Get('auth/facebook/redirect')
  @UseGuards(FacebookGuard)
  async facebookLoginRedirect(@Req() req: Request) {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('auth/google')
  @UseGuards(GoogleGuard)
  async googleLogin() {
    return this.authService.send({ cmd: 'google' }, {});
  }

  @Get('auth/google/redirect')
  @UseGuards(GoogleGuard)
  async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
    const data: any = await this.authService
      .send({ cmd: 'google-redirect' }, { data: req.user })
      .toPromise();
    console.log(data.access_token);
    res.cookie('token', data.access_token);
    res.redirect('http://localhost:5173');
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
      imageThumbnail: Express.Multer.File[];
      imageCover: Express.Multer.File[];
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
    const access_token = req?.headers?.authorization?.split(' ')[1];
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
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('rooms/:id')
  async deleteRoom(@Param('id') id: string) {
    return this.roomService.send({ cmd: 'delete-room' }, { id });
  }
  @Get('amenities')
  async getAllAmenities() {
    return this.roomService.send({ cmd: 'get-amenities' }, {});
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('roomType/:id')
  async deleteRoomType(@Param('id') id: string) {
    return this.roomService.send({ cmd: 'delete-room-type' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('amenity/:id')
  async deleteAmenity(@Param('id') id: string) {
    return this.roomService.send({ cmd: 'delete-amenity' }, { id });
  }
  @Post('rooms/search')
  async seachRoom(@Query() query: { name: string }) {
    return this.roomService.send({ cmd: 'search-room' }, { name: query.name });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('amenity/:id')
  async editAmenity(@Body() body: { name: string }, @Param('id') id: string) {
    return this.roomService.send(
      { cmd: 'edit-amenity' },
      {
        id,
        name: body.name,
      },
    );
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('roomType/:id')
  async editRoomType(
    @Body()
    body: {
      title: string;
      name: string;
      description: string;
      inclusion: string[];
      path: string;
    },
    @Param('id') id: string,
  ) {
    return this.roomService.send({ cmd: 'edit-room-type' }, { ...body, id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('roomType/:id')
  async getRoomTypeById(@Param('id') id: string) {
    return this.roomService.send({ cmd: 'get-room-type-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('room/:id')
  async getRoomById(@Param('id') id: string) {
    return this.roomService.send({ cmd: 'get-room-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('room/:id')
  async EditRoomById(@Param('id') id: string, @Body() body: NewRoomDto) {
    return this.roomService.send({ cmd: 'edit-room-by-id' }, { ...body, id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('amenity/:id')
  async getAmenityById(@Param('id') id: string) {
    return this.roomService.send({ cmd: 'get-amenity-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('user/:id')
  async deleteUserById(@Param('id') id: string) {
    return this.authService.send({ cmd: 'delete-user-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Post('users')
  async addUser(@Body() body: AddUserFromAdminDto) {
    return this.authService.send({ cmd: 'add-user-by-admin' }, body);
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    return this.authService.send({ cmd: 'get-user-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('user/:id')
  async EditUserById(@Param('id') id: string, @Body() body: EditUserDto) {
    return this.authService.send({ cmd: 'edit-user-by-id' }, { id, ...body });
  }
  @Get('bookings')
  async getBookings() {
    return this.bookingService.send({ cmd: 'get-all-booking' }, {});
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('bookings/unconfirm')
  async getBookingsUnConfirm() {
    return this.bookingService.send({ cmd: 'get-all-booking-unconfirm' }, {});
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Delete('bookings/:id')
  async DeleteBookingById(@Param('id') id: string) {
    return this.bookingService.send({ cmd: 'delete-booking-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('bookings/:id')
  async confirmBookingById(@Param('id') id: string) {
    return this.bookingService.send({ cmd: 'confirm-booking-by-id' }, { id });
  }
  @Patch('auth/me')
  async EditMe(@Body() body: EditMeDto, @Req() request: Request) {
    const access_token = request?.headers?.authorization?.split(' ')[1];
    return this.authService.send({ cmd: 'edit-me' }, { ...body, access_token });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Put('bookings/:id')
  async CancelBooking(@Param('id') id: string) {
    return this.bookingService.send({ cmd: 'cancel-booking-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Get('bookings/:id')
  async getBookingsById(@Param('id') id: string) {
    return this.bookingService.send({ cmd: 'get-booking-by-id' }, { id });
  }
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @Patch('bookings/edit/:id')
  async editBookingById(@Param('id') id: string, @Body() body: EditBookingDto) {
    return this.bookingService.send(
      { cmd: 'edit-booking-by-id' },
      { ...body, id },
    );
  }

  @Get('bookings/payment/url')
  async createPaymentUrl(@Body() body: CreateUrlVNpayDto) {
    return this.bookingService.send({ cmd: 'create-payment-url' }, { ...body });
  }
  @Get('bookings/payment/verify-ipn')
  async ipnVerify(@Query() query) {
    return this.bookingService.send(
      { cmd: 'verify-ipn-payment' },
      { ...query },
    );
  }
}
