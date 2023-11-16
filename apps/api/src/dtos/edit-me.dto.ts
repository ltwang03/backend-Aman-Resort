import { IsEmpty, IsNotEmpty } from 'class-validator';

export class EditMeDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  country: string;
  currentPassword?: string;
  password?: string;
}
