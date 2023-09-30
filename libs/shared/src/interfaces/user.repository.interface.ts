import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';
import { User } from '@app/shared/schemas/user.schema';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<User> {}
