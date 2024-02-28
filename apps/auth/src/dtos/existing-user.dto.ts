import { IsEmail, IsNotEmpty } from 'class-validator';

export class ExistingUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}
