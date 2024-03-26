import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';
import { Transaction } from '@app/shared/schemas/transaction.schema';

export interface TransactionRepositoryInterface
  extends BaseInterfaceRepository<Transaction> {}
