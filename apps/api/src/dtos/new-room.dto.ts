import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class NewRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  size: string;
  @IsNotEmpty()
  @IsString()
  roomType: string;
  @IsNotEmpty()
  @IsArray()
  amenities: string[];
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  max_adults: string;
  @IsNotEmpty()
  max_children: string;
}
