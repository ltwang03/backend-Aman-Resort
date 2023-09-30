import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepositoryInterface } from '@app/shared/interfaces/user.repository.interface';
import { NewUserDto } from './dtos/new-user.dto';
import * as bcrypt from 'bcrypt';
import { ExistingUserDto } from './dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly UserRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 12);
    } catch (e) {
      console.error('An error occurred while hashing the password:', e);
      throw new Error('Internal Server Error');
    }
  }

  async register(newUser: Readonly<NewUserDto>) {
    try {
      const { firstname, lastname, phone, country, email, password } = newUser;
      const existingUser = await this.UserRepository.findOneByCondition({
        email,
      });
      if (existingUser) {
        throw new HttpException(
          'An account with that email already exists!',
          HttpStatus.CONFLICT,
        );
      }
      const existingPhone = await this.UserRepository.findOneByCondition({
        phone,
      });
      if (existingPhone) {
        throw new HttpException(
          'An account with that phone number already exists!',
          HttpStatus.CONFLICT,
        );
      }
      const hashPassword = await this.hashPassword(password);
      const saveUser = await this.UserRepository.create({
        firstname,
        lastname,
        phone,
        country,
        email,
        password: hashPassword,
      });
      return { message: 'Register Successfully!', code: HttpStatus.OK };
    } catch (e) {
      if (e instanceof HttpException) {
        return { error: e.getResponse(), statusCode: e.getStatus() };
      }
      console.error(e);
      return {
        error: 'An error occurred during registration.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  async doesPasswordMatch(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
  async validateUser(email: string, _password: string) {
    const user: any = await this.UserRepository.findOneByCondition({ email });

    const doesUserExist = !!user;
    if (!doesUserExist) return null;
    const doesPasswordMatch = await this.doesPasswordMatch(
      _password,
      user.password,
    );
    if (!doesPasswordMatch) return null;
    const {
      delete_at,
      created_at,
      updated_at,
      password,
      __v,
      r_token,
      booked,
      phone,
      ...newUser
    } = user._doc;
    return newUser;
  }
  async login(existingUser: Readonly<ExistingUserDto>) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { access_token, refresh_token } = await this.generateToken(user);
    await this.UserRepository.update(user._id, { r_token: refresh_token });
    return { access_token, refresh_token };
  }

  async refreshToken(token: string) {
    const user: any = await this.UserRepository.findOneByCondition({
      r_token: token,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const {
      delete_at,
      created_at,
      updated_at,
      password,
      __v,
      r_token,
      booked,
      phone,
      ...newUser
    } = user._doc;

    const { access_token, refresh_token } = await this.generateToken(newUser);
    await this.UserRepository.update(user._id, { r_token: refresh_token });
    return { access_token, refresh_token };
  }

  async generateToken(user: any) {
    const [access_token, refresh_token] = await Promise.all([
      await this.jwtService.signAsync(
        { user },
        { secret: process.env.JWT_SECRET_KEY_A, expiresIn: '1d' },
      ),
      await this.jwtService.signAsync(
        { user },
        { secret: process.env.JWT_SECRET_KEY_R, expiresIn: '10d' },
      ),
    ]);
    return { access_token, refresh_token };
  }
  async verify_jwt(jwt: string) {
    if (!jwt) throw new UnauthorizedException();
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt, {
        secret: process.env.JWT_SECRET_KEY_A,
      });
      return { exp };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
  async verify_r_jwt(jwt: string) {
    if (!jwt) throw new UnauthorizedException();
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt, {
        secret: process.env.JWT_SECRET_KEY_R,
      });
      return { exp };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
