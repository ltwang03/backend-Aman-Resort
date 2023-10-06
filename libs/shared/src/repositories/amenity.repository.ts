import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@app/shared';
import { Amenity } from '@app/shared/schemas/amenity.schema';
import { AmenityRepositoryInterface } from '@app/shared/interfaces/amenity.repository.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AmenityRepository
  extends BaseRepositoryAbstract<Amenity>
  implements AmenityRepositoryInterface
{
  constructor(
    @InjectModel(Amenity.name)
    private readonly AmenityRepository: Model<Amenity>,
  ) {
    super(AmenityRepository);
  }
}
