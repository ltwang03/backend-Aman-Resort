import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Booking } from '@app/shared/schemas/booking.schema';
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Transaction extends BaseEntity {
  @Prop({ type: String, required: true })
  order_id: string;
  @Prop({ type: Number, required: true })
  amount: Number;
  @Prop({ type: String, required: true })
  status_payment: String;
  @Prop({ type: String, required: true })
  bank_code: String;
  @Prop({ type: String, required: true })
  card_type: String;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'booking' })
  booking_id: Booking;
}
export type TransactionDocument = HydratedDocument<Transaction>;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
