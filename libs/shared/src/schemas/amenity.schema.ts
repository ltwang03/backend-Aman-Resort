import { BaseEntity } from '@app/shared/repositories/bases/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Room } from '@app/shared/schemas/room.schema';
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Amenity extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] })
  rooms: Room[];
}
export type AmenityDocument = HydratedDocument<Amenity>;
export const AmenitySchema = SchemaFactory.createForClass(Amenity);
