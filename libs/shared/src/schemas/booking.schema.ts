import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '@app/shared/schemas/room.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Booking extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  firstName: string;
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
  @Prop({ type: String, required: true })
  note: string;
  @Prop({ type: Date, required: true })
  check_in: Date;
  @Prop({ type: Date, required: true })
  check_out: Date;
  @Prop({ type: Number, required: true })
  slot: number;
  @Prop({ type: Number, required: true })
  fee: number;
  @Prop({ type: Number, required: true })
  totalPrice: number;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  rooms: Room[];
}
export type BookingDocument = HydratedDocument<Room>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
