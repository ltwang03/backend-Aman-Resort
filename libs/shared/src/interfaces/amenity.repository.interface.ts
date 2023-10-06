import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';
import { Amenity } from '@app/shared/schemas/amenity.schema';

export interface AmenityRepositoryInterface
  extends BaseInterfaceRepository<Amenity> {}
