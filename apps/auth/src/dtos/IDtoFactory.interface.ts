import { NewUserDto } from './new-user.dto';
import { ExistingUserDto } from './existing-user.dto';

export interface IDtoFactory {
  createDto(type: string, data: any): any;
  createNewUser(data: any): NewUserDto;
  createExistingUser(data: any): ExistingUserDto;
}
