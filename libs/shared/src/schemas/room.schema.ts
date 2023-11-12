import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoomType } from '@app/shared/schemas/roomType.schema';
import { Amenity } from '@app/shared/schemas/amenity.schema';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Room extends BaseEntity {
  @Prop({ type: String, required: true, index: true })
  name: string;
  @Prop({ type: String })
  slug: string;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: Number, required: true })
  size: number;
  @Prop({ type: [String], required: true })
  imageThumbnail: string[];
  @Prop({ type: [String], required: true })
  imageCover: string[];
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RoomType' })
  roomType: RoomType;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }] })
  amenities: Amenity[];
  @Prop({ type: Boolean, default: false })
  booking: boolean;
  @Prop({ type: Number, required: true })
  price: number;
  @Prop({ type: Number, required: true })
  max_adults: number;
  @Prop({ type: Number, required: true })
  max_children: number;
}
export type RoomDocument = HydratedDocument<Room>;
const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.index({ name: 'text' });
export { RoomSchema };
