import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  size: number;
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
