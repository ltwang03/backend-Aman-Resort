import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRequestInterface } from '../interfaces/jwt-request.interface';
@Injectable()
export class R_jwtStrategy extends PassportStrategy(Strategy, 'r_jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequestInterface) => {
          return request?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY_R,
    });
  }
  async validate(payload: any) {
    return { ...payload };
  }
}
