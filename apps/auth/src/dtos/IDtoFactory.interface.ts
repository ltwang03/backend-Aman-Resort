import { NewUserDto } from './new-user.dto';
import { ExistingUserDto } from './existing-user.dto';

export interface IDtoFactory {
  createNewUser(data: any): NewUserDto;
  ExistingUser(data: any): ExistingUserDto;
}
