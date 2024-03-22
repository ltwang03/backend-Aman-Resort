import { BaseInterfaceRepository } from '@app/shared/repositories/bases/base.interface.repository';
import { OTP } from '@app/shared/schemas/otp.schema';

export interface OtpRepositoryInterface
  extends BaseInterfaceRepository<OTP> {}
