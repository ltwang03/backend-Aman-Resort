import { IsNotEmpty, IsString } from 'class-validator';

export class NewAmenityDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
