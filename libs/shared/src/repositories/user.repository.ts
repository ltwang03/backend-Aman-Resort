import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@app/shared/repositories/base.abstract.repository';
import { User } from '@app/shared/schemas/user.schema';
import { UserRepositoryInterface } from '@app/shared/interfaces/user.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository
  extends BaseRepositoryAbstract<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectModel(User.name) private readonly UserRepository: Model<User>,
  ) {
    super(UserRepository);
  }
}
