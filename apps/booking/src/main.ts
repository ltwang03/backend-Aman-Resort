import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(BookingModule);
  const configService: ConfigService = app.get(ConfigService);
  const sharedService: SharedService = app.get(SharedService);
  const queue = configService.getOrThrow('RABBITMQ_BOOKING_QUEUE');
  app.connectMicroservice(sharedService.getRmqOptions(queue));
  await app.startAllMicroservices();
}
bootstrap();
