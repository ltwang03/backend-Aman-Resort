import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@app/shared';
import * as process from 'process';
import { AuthGuard } from '@app/shared/guards/auth.guard';
import { Auth_rGuard } from '@app/shared/guards/auth_r.guard';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, Auth_rGuard],
})
export class AppModule {}
