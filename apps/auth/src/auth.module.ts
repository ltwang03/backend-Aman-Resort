import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongodbModule, SharedModule, SharedService } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/shared/schemas/user.schema';
import { UserRepository } from '@app/shared/repositories/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { R_jwtGuard } from './r_jwt.guard';
import { R_jwtStrategy } from './strategies/r_jwt.strategy';
import { BookingRepository } from '@app/shared/repositories/booking.repository';
import { Booking, BookingSchema } from '@app/shared/schemas/booking.schema';
import { OtpRepository } from '@app/shared/repositories/otp.repository';
import { OTP, OTPSchema } from '@app/shared/schemas/otp.schema';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY_A'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    MailModule,
    MongodbModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      {name: OTP.name, schema: OTPSchema}
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    R_jwtGuard,
    JwtGuard,
    JwtService,
    JwtStrategy,
    R_jwtStrategy,
    { provide: 'SharedServiceInterface', useClass: SharedService },
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
    { provide: 'BookingRepositoryInterface', useClass: BookingRepository },
    {provide:'OtpRepositoryInterface', useClass: OtpRepository}
  ],
})
export class AuthModule {}
