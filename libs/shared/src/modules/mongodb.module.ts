import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_URI'),
        dbName: configService.getOrThrow('MONGO_INITDB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongodbModule {}
