import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AddUserFromAdminDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsString()
  role: string;
}
