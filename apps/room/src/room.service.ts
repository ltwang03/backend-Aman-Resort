import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  getHello(): string {
    return 'Hello World!';
  }
}
