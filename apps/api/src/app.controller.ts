import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';

import { ClientProxy } from '@nestjs/microservices';
import { NewUserDto } from './dtos/new-user.dto';
import { ExistingUserDto } from './dtos/existing-user.dto';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Auth_rGuard } from '@app/shared/guards/auth_r.guard';
import { Request } from 'express';

@Controller('auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() newUser: NewUserDto) {
    const { firstname, lastname, phone, country, email, password } = newUser;
    return this.authService.send(
      { cmd: 'register' },
      { firstname, lastname, phone, country, email, password },
    );
  }
  @Post('login')
  async login(@Body() existingUser: ExistingUserDto) {
    const { email, password } = existingUser;
    return this.authService.send({ cmd: 'login' }, { email, password });
  }

  @UseGuards(Auth_rGuard)
  @Get('refresh')
  async refresh(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.authService.send({ cmd: 'refresh' }, { token });
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() request: Request) {
    const token = request.headers['authorization'].split(' ')[1];
    return this.authService.send({ cmd: 'me' }, { token });
  }
}
