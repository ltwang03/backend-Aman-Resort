import { NewUserDto } from './new-user.dto';
import { ExistingUserDto } from './existing-user.dto';

export class DtoFactory {
  createNewUser(data: any): NewUserDto {
    return new NewUserDto(data);
  }
  ExistingUser(data: any): ExistingUserDto {
    return new ExistingUserDto(data);
  }
}
