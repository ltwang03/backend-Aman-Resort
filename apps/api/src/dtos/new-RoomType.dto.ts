import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class NewRoomTypeDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  path: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsArray()
  inclusion: string[];
}
