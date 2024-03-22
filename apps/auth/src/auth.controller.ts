import { Controller, Inject, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { JwtGuard } from './jwt.guard';
import { R_jwtGuard } from './r_jwt.guard';
import { DtoFactory } from './dtos/dto.factory';

@Controller()
export class AuthController {
  private readonly dtoFactory: DtoFactory;
  constructor(
    private readonly authService: AuthService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,


  ) {
    this.dtoFactory = new DtoFactory();
  }

  @MessagePattern({ cmd: 'register' })
  Register(@Payload() newUser, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.register(this.dtoFactory.createDto("NewUser", newUser));
  }

  @MessagePattern({ cmd: 'login' })
  Login(@Payload() existingUser, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.login(this.dtoFactory.createDto("ExistingUser",existingUser));
  }

  @MessagePattern({cmd: 'login-v2'})
  loginV2(@Payload() existingUser, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.loginV2(this.dtoFactory.createDto("ExistingUser", existingUser));
  }

  @MessagePattern({cmd: 'verify-otp'})
  verifyOtp(@Payload() payload,@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.verifyOtp(payload);
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
  @MessagePattern({ cmd: 'get-all-users' })
  async getAllUser(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getAllUser();
  }
  @MessagePattern({ cmd: 'decode_jwt' })
  decode_jwt(@Payload() payload: { jwt: string }, @Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUserFromHeader(payload.jwt);
  }
  @MessagePattern({ cmd: 'delete-user-by-id' })
  async deleteUserById(
    @Ctx() context: RmqContext,
    @Payload() payload: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.deleteUserById(payload.id);
  }
  @MessagePattern({ cmd: 'add-user-by-admin' })
  async addUser(@Ctx() context: RmqContext, @Payload() payload) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.addUserFromAdmin(payload);
  }
  @MessagePattern({ cmd: 'get-user-by-id' })
  async getUserById(@Ctx() context: RmqContext, @Payload() payload) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.getUserById(payload.id);
  }
  @MessagePattern({ cmd: 'edit-user-by-id' })
  async editUserById(@Ctx() context: RmqContext, @Payload() payload) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.EditUserById(payload);
  }
  @MessagePattern({ cmd: 'edit-me' })
  async edit_me(@Ctx() context: RmqContext, @Payload() payload) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.editMe(payload);
  }
}
