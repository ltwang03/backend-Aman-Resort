import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: `http://localhost:3000/auth/facebook/redirect`,
      scope: "email",
      passReqToCallback: false,
      profileFields: ["emails", "name"],
    });
  }
  async validate(accessToken: string, profile :Profile, done: (error: any, user:any, info?: any) => void): Promise<any>  {
  console.log(profile);
  console.log(accessToken)
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastname: name.familyName,
      role: 'User'
    }
    const payload = {
      user,
      access_token: accessToken
    }
    done(null, payload)
  }
}
