import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Customer {}
export const customerSchema = SchemaFactory.createForClass(Customer);
