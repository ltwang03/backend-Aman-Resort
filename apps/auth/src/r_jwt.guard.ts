import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class R_jwtGuard extends AuthGuard('r_jwt') {}
