import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@app/shared/schemas/user.schema';
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class OTP extends BaseEntity {
  @Prop( { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' })
  userId: User;
  @Prop({type: String})
  otp: string;
  @Prop({type: String, required: true})
  useCase: string;
  @Prop({type: Date, required: true})
  isExpire: Date;
}
export type OtpDocument = HydratedDocument<OTP>;
export const OTPSchema = SchemaFactory.createForClass(OTP);
