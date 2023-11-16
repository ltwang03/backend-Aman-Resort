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
import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly UserRepository: UserRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly BookingRepository: BookingRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 12);
    } catch (e) {
      console.error('An error occurred while hashing the password:', e);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  validatePhoneNumber(phoneNumber) {
    const regex = /^(0|\+[0-9]+)?[0-9]*$/;
    return regex.test(phoneNumber);
  }
  async register(newUser: Readonly<NewUserDto>) {
    try {
      const { firstname, lastname, phone, country, email, password } = newUser;
      if (this.validatePhoneNumber(phone) == false) {
        return { message: 'phone is not valid', code: 400 };
      }
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
    try {
      const { email, password } = existingUser;
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new HttpException(
          'Invalid Email or Password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const { access_token, refresh_token } = await this.generateToken(user);
      await this.UserRepository.update(user._id, { r_token: refresh_token });
      return { access_token, refresh_token };
    } catch (e) {
      if (e instanceof HttpException) {
        return { error: e.getResponse(), statusCode: e.getStatus() };
      }
      return e;
    }
  }

  async refreshToken(token: string) {
    try {
      const user: any = await this.UserRepository.findOneByCondition({
        r_token: token,
      });
      if (!user) {
        throw new HttpException('Invalid token!', HttpStatus.UNAUTHORIZED);
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
    } catch (e) {
      if (e instanceof HttpException) {
        return { error: e.getResponse(), statusCode: e.getStatus() };
      }
      return e;
    }
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
      throw new UnauthorizedException('Invalid token!');
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
      throw new UnauthorizedException('Invalid token!');
    }
  }
  async getUserFromHeader(jwt: string) {
    if (!jwt) throw new UnauthorizedException();
    try {
      return this.jwtService.decode(jwt);
    } catch (e) {
      throw new UnauthorizedException('Invalid token!');
    }
  }
  async getAllUser() {
    const data = await this.UserRepository.findAllWithPopulate({});
    return {
      status: HttpStatus.OK,
      message: 'OK',
      data,
    };
  }
  async getMe(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.getUserFromHeader(token);
    const user: any = await this.UserRepository.findOneByCondition(
      {
        _id: payload['user']['_id'],
      },
      'booked',
    );
    const { delete_at, r_token, password, created_at, updated_at, ...others } =
      user._doc;
    if (!user) {
      throw new UnauthorizedException();
    }
    return others;
  }
  async deleteUserById(id) {
    if (!id) {
      return { message: 'Invalid Input', code: 400 };
    }
    const user = await this.UserRepository.findOneById(id);
    if (!user) {
      return { message: 'User not found', code: 400 };
    }
    try {
      await this.UserRepository.softDelete(id);
      return { message: 'Deleted', code: 200 };
    } catch (error) {
      return error;
    }
  }
  async addUserFromAdmin(payload) {
    const { firstname, lastname, phone, country, email, password, role } =
      payload;
    if (this.validatePhoneNumber(phone) == false) {
      return { message: 'Phone is not valid', code: 400 };
    }
    try {
      const checkEmailExist = await this.UserRepository.findOneByCondition({
        email,
      });
      if (checkEmailExist) {
        return {
          message: 'An account with that email already exists! ',
          code: 400,
        };
      }
      const checkExistPhone = await this.UserRepository.findOneByCondition({
        phone,
      });
      if (checkExistPhone) {
        return { message: 'Phone is already exists!', code: 400 };
      }
      const hashPassword = await this.hashPassword(password);
      const saveUser = await this.UserRepository.create({
        firstname,
        lastname,
        phone,
        country,
        email,
        password: hashPassword,
        role,
      });
      return {
        message: 'Create User Successfully',
        code: 200,
      };
    } catch (error) {
      return error;
    }
  }
  async getUserById(id) {
    if (!id) {
      return { message: 'Invalid Input', code: 400 };
    }
    const user = await this.UserRepository.findOneById(id);
    if (!user) {
      return { message: 'User not found', code: 400 };
    } else {
      return { message: 'OK', code: 200, user };
    }
  }
  async EditUserById(payload) {
    const { id, ...others } = payload;
    if (this.validatePhoneNumber(payload.phone) == false) {
      return { message: 'phone is not valid', code: 400 };
    }
    if (!id) {
      return { message: 'Invalid Input', code: 400 };
    }
    const checkIdUser = await this.UserRepository.findOneById(id);
    if (!checkIdUser) {
      return { message: 'Id not found', code: 400 };
    }
    try {
      const updateUser = await this.UserRepository.update(id, {
        ...others,
      });
      return { message: 'Edited', code: 200 };
    } catch (error) {
      return error;
    }
  }
}
