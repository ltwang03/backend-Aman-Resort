import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@app/shared';
import * as process from 'process';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Auth_rGuard } from '@app/shared/guards/auth_r.guard';
import { RolesGuard } from '@app/shared/guards/roles.guard';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq('ROOM_SERVICE', process.env.RABBITMQ_ROOM_QUEUE),
    SharedModule.registerRmq(
      'BOOKING_SERVICE',
      process.env.RABBITMQ_BOOKING_QUEUE,
    ),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, Auth_rGuard, RolesGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
