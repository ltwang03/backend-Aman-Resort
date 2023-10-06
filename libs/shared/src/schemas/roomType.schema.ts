import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '@app/shared/schemas/room.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class RoomType extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: [String], required: true })
  inclusion: string[];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  rooms: Room[];
}

export type RoomTypeDocument = HydratedDocument<RoomType>;
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
