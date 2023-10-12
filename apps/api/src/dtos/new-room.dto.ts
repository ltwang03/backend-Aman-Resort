import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class NewRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  roomType: string;
  @IsNotEmpty()
  @IsArray()
  amenities: string[];
}
