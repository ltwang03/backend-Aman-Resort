import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '@app/shared/schemas/room.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
enum PaymentStatus {
  paid = 'Đã thanh toán',
  unPaid = 'Chưa Thanh toán',
}
enum Status {
  confirmed = 'Đã xác nhận',
  unConfirmed = 'Chưa xác nhận',
  cancel = 'Đã hủy',
}
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Booking extends BaseEntity {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  phone: string;
  @Prop({
    type: String,
    required: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;
  @Prop({ type: String, required: true })
  country: string;
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: String, required: true })
  city: string;
  @Prop({ type: String, required: true })
  zipCode: string;
  @Prop({ type: String })
  note: string;
  @Prop({ type: Date, required: true })
  start: Date;
  @Prop({ type: Date, required: true })
  end: Date;
  @Prop({ type: Number, required: true })
  adults: number;
  @Prop({ type: Number, required: true })
  children: number;
  @Prop({ type: Number, required: true })
  fee: number;
  @Prop({ type: Number, required: true })
  totalPrice: number;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  rooms: Room[];
  @Prop({ type: String, required: true, default: PaymentStatus.unPaid })
  payment_status: string;
  @Prop({ type: String, required: true, default: Status.unConfirmed })
  status: string;
}
export type BookingDocument = HydratedDocument<Room>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
