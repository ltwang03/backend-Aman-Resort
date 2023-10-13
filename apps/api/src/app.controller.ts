import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFile,
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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { NewRoomDto } from './dtos/new-room.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('ROOM_SERVICE') private readonly roomService: ClientProxy,
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
  @Get('ath/refresh')
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
    const { name, description, roomType, amenities } = newRoomDto;
    return this.roomService.send(
      { cmd: 'create-new-room' },
      {
        name,
        description,
        imageThumbnail: files.imageThumbnail,
        imageCover: files.imageCover,
        roomType,
        amenities,
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
}
