import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ROLES_KEY } from '../../common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(ROLES_KEY, context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;
    const authHeaderParts = (authHeader as string).split(' ');
    if (authHeaderParts.length !== 2) return false;
    const [, jwt] = authHeaderParts;
    return this.authService.send({ cmd: 'decode_jwt' }, { jwt }).pipe(
      switchMap((payload) => {
        const role = payload['user']['role'];
        if (!payload) return of(false);
        const isJwtValid = roles.includes(role);
        return of(isJwtValid);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}
