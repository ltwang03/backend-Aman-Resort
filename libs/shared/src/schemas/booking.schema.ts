import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Booking {
  @Prop({
    type: [
      {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        phone: { String },
      },
    ],
  })
  Customer: [{ firstname: string; lastname: string; phone: string }];
}

export type BookingDocument = Booking & Document;
export const BookingSchema = SchemaFactory.createForClass(Booking);
