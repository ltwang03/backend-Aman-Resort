import { Controller, Inject, UseGuards } from '@nestjs/common';
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
