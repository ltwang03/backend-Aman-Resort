import { Injectable } from '@nestjs/common';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  v2 as cloudinary,
} from 'cloudinary';
const streamifier = require('streamifier');
@Injectable()
export class StorageService {
  async uploadImage(file: Express.Multer.File) {
    try {
      const buffer = Buffer.from(file.buffer);
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
          streamifier.createReadStream(buffer).pipe(upload);
        },
      );
    } catch (e) {
      return e;
    }
  }
  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map((file) => {
      const buffer = Buffer.from(file.buffer);
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          });
          streamifier.createReadStream(buffer).pipe(upload);
        },
      );
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw error;
    }
  }
}
