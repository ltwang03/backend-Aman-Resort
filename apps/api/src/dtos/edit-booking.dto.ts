import { IsNotEmpty, IsString } from 'class-validator';

export class EditBookingDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsNotEmpty()
  @IsString()
  status: string;
  @IsNotEmpty()
  @IsString()
  payment_status: string;
}
