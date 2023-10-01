import { Controller, Inject, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { NewUserDto } from './dtos/new-user.dto';
import { ExistingUserDto } from './dtos/existing-user.dto';
import { JwtGuard } from './jwt.guard';
import { R_jwtGuard } from './r_jwt.guard';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'register' })
  Register(@Payload() newUser: NewUserDto, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(newUser);
  }

  @MessagePattern({ cmd: 'login' })
  Login(@Payload() existingUser: ExistingUserDto, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(existingUser);
  }
  @MessagePattern({ cmd: 'refresh' })
  refreshToken(
    @Payload() payload: { token: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.refreshToken(payload.token);
  }
  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  verify(@Payload() payload: { jwt: string }, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verify_jwt(payload.jwt);
  }
  @MessagePattern({ cmd: 'verify_r_jwt' })
  @UseGuards(R_jwtGuard)
  verify_r_jwt(
    @Payload() payload: { jwt: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verify_r_jwt(payload.jwt);
  }

  @MessagePattern({ cmd: 'me' })
  async getMe(
    @Payload() payload: { token: string },
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getMe(payload.token);
  }
}
