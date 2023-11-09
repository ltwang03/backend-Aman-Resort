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
  @IsString()
  price: string;
  @IsNotEmpty()
  @IsString()
  max_adults: string;
  @IsNotEmpty()
  @IsString()
  max_children: string;
}
