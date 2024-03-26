import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@app/shared/repositories/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '@app/shared/schemas/transaction.schema';
import { TransactionRepositoryInterface } from '@app/shared/interfaces/transaction.repository.interface';

@Injectable()
export class TransactionRepository
  extends BaseRepositoryAbstract<Transaction>
  implements TransactionRepositoryInterface
{
  constructor(
    @InjectModel(Transaction.name)
    private readonly TransactionRepository: Model<Transaction>,
  ) {
    super(TransactionRepository);
  }
}
