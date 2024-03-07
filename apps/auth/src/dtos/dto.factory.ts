import { NewUserDto } from './new-user.dto';
import { ExistingUserDto } from './existing-user.dto';
import { IDtoFactory } from './IDtoFactory.interface';

export class DtoFactory implements IDtoFactory {
  createNewUser(data: any): NewUserDto {
    return new NewUserDto(data);
  }
  ExistingUser(data: any): ExistingUserDto {
    return new ExistingUserDto(data);
  }
}
