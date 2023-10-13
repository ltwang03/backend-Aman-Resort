import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';
import { RoomTypeRepositoryInterface } from '@app/shared/interfaces/roomType.repository.interface';
import { AmenityRepositoryInterface } from '@app/shared/interfaces/amenity.repository.interface';
import { StorageService } from '@app/shared';

@Injectable()
export class RoomService {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly RoomRepository: RoomRepositoryInterface,
    @Inject('RoomTypeRepositoryInterface')
    private readonly RoomTypeRepository: RoomTypeRepositoryInterface,
    @Inject('AmenityRepositoryInterface')
    private readonly AmenityRepository: AmenityRepositoryInterface,
    private readonly storageService: StorageService,
  ) {}
  async createAmenity(name: string) {
    try {
      const existingAmenity = await this.AmenityRepository.findOneByCondition({
        name,
      });
      if (existingAmenity) {
        throw new HttpException('Amenity already exists', HttpStatus.CONFLICT);
      }
      await this.AmenityRepository.create({ name });
      return { status: 200, message: 'Amenity created successfully' };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async createRoomType(payload) {
    const { title, name, path, description, inclusion } = payload;
    try {
      const existingRoomType = await this.RoomTypeRepository.findOneByCondition(
        { name },
      );
      if (existingRoomType) {
        throw new HttpException(
          'Room type already exists',
          HttpStatus.CONFLICT,
        );
      }
      if (inclusion.length < 1) {
        throw new HttpException(
          'Room type must have at least one inclusion',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.RoomTypeRepository.create({
        title,
        name,
        path,
        description,
        inclusion,
      });
      return { status: 200, message: 'Room type created successfully' };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async createRoom(payload) {
    const {
      name,
      description,
      imageThumbnail,
      imageCover,
      roomType,
      amenities,
    } = payload;
    function slugify(text) {
      // Chuyển đổi các ký tự có dấu thành ký tự không dấu
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // Loại bỏ các ký tự đặc biệt
      text = text.replace(/[^\w\s-]/g, '');
      // Thay thế khoảng trắng bằng dấu gạch ngang
      text = text.replace(/\s+/g, '-');
      return text.toLowerCase();
    }
    const slug = slugify(name);
    try {
      const existingRoom = await this.RoomRepository.findOneByCondition({
        name,
      });
      if (existingRoom) {
        throw new HttpException('Room already exists', HttpStatus.CONFLICT);
      }
      const existingRoomType = await this.RoomTypeRepository.findOneById(
        roomType,
      );
      if (!existingRoomType) {
        throw new HttpException('Invalid roomType', HttpStatus.BAD_REQUEST);
      }
      const existingAmenities = await Promise.all(
        amenities.map((amenity) => this.AmenityRepository.findOneById(amenity)),
      );
      const invalidAmenities = existingAmenities.filter((amenity) => !amenity);
      if (invalidAmenities.length > 0) {
        throw new HttpException('Invalid amenities', HttpStatus.BAD_REQUEST);
      }
      const [imagesThumbnail, imagesCover] = await Promise.all([
        this.storageService.uploadMultipleImages(imageThumbnail),
        this.storageService.uploadMultipleImages(imageCover),
      ]);
      const [listImageThumbnail, listImageCover] = await Promise.all([
        imagesThumbnail.map((image) => image.url),
        imagesCover.map((value) => value.url),
      ]);
      const saveRoom = await this.RoomRepository.create({
        name,
        slug,
        description,
        imageThumbnail: listImageThumbnail,
        imageCover: listImageCover,
        roomType,
        amenities,
      });
      const updateRoomType = await this.RoomTypeRepository.updateList(
        roomType,
        {
          rooms: [saveRoom],
        },
      );
      const updateListAmenities = await Promise.all(
        amenities.map((amenity) => {
          const updateAmenity = this.AmenityRepository.updateList(amenity, {
            rooms: [saveRoom],
          });
        }),
      );
      return { status: 200, message: 'Room created successfully' };
    } catch (e) {
      if (e instanceof HttpException) return e;
      return e;
    }
  }
  async getAllRooms() {
    try {
      const data = await this.RoomRepository.findAllWithPopulate(
        {},
        'roomType',
        'amenities',
      );
      if (!data) {
        throw new HttpException('No room found', HttpStatus.NOT_FOUND);
      }
      return data;
    } catch (e) {
      if (e instanceof HttpException) return e;
      return e;
    }
  }
  async getRoomType(roomType) {
    try {
      const data = await this.RoomTypeRepository.findOneByCondition(
        {
          path: roomType,
        },
        'rooms',
      );
      if (!data) {
        throw new HttpException('No room type found', HttpStatus.NOT_FOUND);
      }
      return data;
    } catch (e) {
      if (e instanceof HttpException) return e;
      return e;
    }
  }
  async getRoomBySlug(path, slug) {
    try {
      const checkPath = await this.RoomTypeRepository.findOneByCondition(
        { path },
        'rooms',
      );
      if (!checkPath) {
        throw new HttpException('Invalid path', HttpStatus.BAD_REQUEST);
      }

      const room = checkPath.rooms.find((room) => room.slug === slug);
      if (!room) {
        throw new HttpException('Invalid slug', HttpStatus.BAD_REQUEST);
      }

      const data = await this.RoomRepository.findOneByCondition(
        { slug },
        'roomType',
        'amenities',
      );
      return data;
    } catch (e) {
      if (e instanceof HttpException) return e;
      return e;
    }
  }
  async getAllRoomTypes() {
    try {
      const data = await this.RoomTypeRepository.findAllWithPopulate({});
      if (!data) {
        throw new HttpException('No room type found', HttpStatus.NOT_FOUND);
      }
      return data;
    } catch (e) {
      if (e instanceof HttpException) return e;
      return e;
    }
  }
}
