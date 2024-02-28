import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class NewUserDto {
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
  @IsStrongPassword()
  password: string;
  constructor({ firstname, lastname, phone, country, email, password }) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.country = country;
    this.email = email;
    this.password = password;
  }
}
