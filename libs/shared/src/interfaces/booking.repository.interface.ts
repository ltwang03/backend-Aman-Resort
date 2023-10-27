import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';
import { Booking } from '@app/shared/schemas/booking.schema';

export interface BookingRepositoryInterface
  extends BaseInterfaceRepository<Booking> {}
