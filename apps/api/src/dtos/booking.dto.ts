import { IsArray, IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class BookingDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  zipCode: string;
  note?: string;
  @IsNotEmpty()
  start: string;
  @IsNotEmpty()
  end: string;
  @IsNotEmpty()
  adults: number;
  @IsNotEmpty()
  children: number;
  @IsNotEmpty()
  fee: number;
  @IsNotEmpty()
  totalPrice: number;
  @IsNotEmpty()
  @IsArray()
  rooms: string[];
}
