import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Booking } from '@app/shared/schemas/booking.schema';
import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
enum Role {
  User = 'User',
  Admin = 'Admin',
}
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends BaseEntity {
  @Prop({ type: String, required: true })
  firstname: string;
  @Prop({ type: String, required: true })
  lastname: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  phone: string;
  @Prop({ type: String, required: true })
  country: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;
  @Prop({ type: String })
  date_of_birth: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: String })
  r_token?: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }] })
  booked?: Booking;
  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
