import { NewUserDto } from './new-user.dto';
import { ExistingUserDto } from './existing-user.dto';
import { IDtoFactory } from './IDtoFactory.interface';

export class DtoFactory implements IDtoFactory {
  createDto(type: string, data: any):any {
    switch(type) {
      case 'NewUser':
        return this.createNewUser(data);
      case 'ExistingUser':
        return this.createExistingUser(data);
      default:
        throw new Error(`DTO type ${type} not recognized.`);
    }
  }

  public createNewUser(data: any): NewUserDto {
    return new NewUserDto(data)
  }

  public createExistingUser(data: any): ExistingUserDto {
    return new ExistingUserDto(data)
  }
}
