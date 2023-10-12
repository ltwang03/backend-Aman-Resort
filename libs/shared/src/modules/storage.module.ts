import { Module } from '@nestjs/common';
import { StorageService } from '@app/shared/services/storage.service';
import { CloudinaryProvider } from '@app/shared/providers/cloudinary.provider';

@Module({
  providers: [CloudinaryProvider, StorageService],
  exports: [CloudinaryProvider, StorageService],
})
export class StorageModule {}
