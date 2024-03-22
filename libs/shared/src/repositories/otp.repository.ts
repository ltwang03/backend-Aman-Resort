import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@app/shared';
import { OTP } from '@app/shared/schemas/otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpRepositoryInterface } from '@app/shared/interfaces/otp.repository.interface';

@Injectable()
export class OtpRepository
  extends BaseRepositoryAbstract<OTP>
  implements OtpRepositoryInterface
{
  constructor(
    @InjectModel(OTP.name) private readonly OtpRepository: Model<OTP>,
  ) {
    super(OtpRepository);
  }
}
