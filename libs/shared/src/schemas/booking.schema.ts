import { Schema } from '@nestjs/mongoose';
import { BaseEntity } from '@app/shared/repositories/bases/base.entity';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Booking extends BaseEntity {}
