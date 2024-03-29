import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { RoomRepositoryInterface } from '@app/shared/interfaces/room.repository.interface';
import { RoomTypeRepositoryInterface } from '@app/shared/interfaces/roomType.repository.interface';
import { AmenityRepositoryInterface } from '@app/shared/interfaces/amenity.repository.interface';
import { StorageService } from '@app/shared';
import { BookingRepositoryInterface } from '@app/shared/interfaces/booking.repository.interface';
import { Booking } from '@app/shared/schemas/booking.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Amenity } from '@app/shared/schemas/amenity.schema';
import * as moment from 'moment';

@Injectable({ scope: Scope.DEFAULT })
export class RoomService {
  constructor(
    @Inject('RoomRepositoryInterface')
    private readonly RoomRepository: RoomRepositoryInterface,
    @Inject('RoomTypeRepositoryInterface')
    private readonly RoomTypeRepository: RoomTypeRepositoryInterface,
    @Inject('AmenityRepositoryInterface')
    private readonly AmenityRepository: AmenityRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly BookingRepository: BookingRepositoryInterface,
    @InjectModel(Booking.name) private BookingModel: Model<Booking>,
    @InjectModel(Amenity.name) private AmenityModel: Model<Amenity>,
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
  slugify(text) {
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    text = text.replace(/[^\w\s-]/g, '');
    text = text.replace(/\s+/g, '-');
    return text.toLowerCase();
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
      size,
      imageThumbnail,
      imageCover,
      roomType,
      amenities,
      price,
      max_adults,
      max_children,
    } = payload;
    function slugify(text) {
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      text = text.replace(/[^\w\s-]/g, '');
      text = text.replace(/\s+/g, '-');
      return text.toLowerCase();
    }

    const slug = this.slugify(name);
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
        size,
        imageThumbnail: listImageThumbnail,
        imageCover: listImageCover,
        roomType,
        amenities,
        price,
        max_adults,
        max_children,
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
  async SearchRoomForBooking(payload) {
    const { start, end, adults = 0, children = 0 } = payload;
    if (!payload) {
      throw new Error('Payload is required');
    }

    if (!start || !end) {
      throw new Error('Start and end date are required');
    }
    if (adults < 0) {
      throw new Error('Adults must be a positive number');
    }

    if (children < 0) {
      throw new Error('Children must be a positive number');
    }

    const formatStartToDate = moment(start, 'DD-MM-YYYY').toDate();
    const formatEndToDate = moment(end, 'DD-MM-YYYY').toDate();
    if (formatStartToDate >= formatEndToDate) {
      throw new Error('Start date must be before end date');
    }

    const unavailableRooms: any = await this.BookingModel.find({
      start: { $gte: formatStartToDate, $lte: formatEndToDate },
    }).lean();
    const listRoomReject = [];
    const mapRoom = unavailableRooms.map((value) =>
      listRoomReject.push(value.rooms[0]),
    );
    const roomForBooking = await this.RoomRepository.findAllWithPopulate(
      {
        _id: { $nin: listRoomReject },
        max_adults: { $gte: parseInt(adults) },
        max_children: { $gte: parseInt(children) },
      },
      'roomType',
    );
    if (!roomForBooking) {
      return {
        status: HttpStatus.OK,
        data: [],
      };
    }
    return {
      code: HttpStatus.OK,
      data: roomForBooking,
    };
  }
  async deleteRoom(id: string) {
    if (typeof id !== 'string') {
      return {
        message: 'ID not found',
        code: HttpStatus.NOT_FOUND,
      };
    }
    const room = await this.RoomRepository.findOneById(id);
    if (!room) {
      return { message: 'ID not exist!', code: HttpStatus.NOT_FOUND };
    }
    try {
      await this.RoomTypeRepository.update(room.roomType?._id, {
        $pull: { rooms: id },
      });
      for (const amenity of room.amenities) {
        await this.AmenityRepository.update(amenity._id, {
          $pull: { rooms: id },
        });
      }
      await this.RoomRepository.softDelete(id);
      return {
        message: 'Deleted',
        code: HttpStatus.OK,
      };
    } catch (e) {
      return e;
    }
  }
  async getAmenities() {
    try {
      const amenities = await this.AmenityRepository.findAllWithPopulate({});
      return amenities;
    } catch (e) {
      return e;
    }
  }
  async deleteRoomType(id) {
    if (typeof id !== 'string') {
      return { message: 'type id not found', code: 400 };
    }
    try {
      const query = await this.RoomTypeRepository.softDelete(id);
      return { message: 'Deleted', code: 200 };
    } catch (error) {
      console.log(error);
    }
  }
  async deleteAmenity(id) {
    if (typeof id !== 'string') {
      return { message: 'type id not found', code: 400 };
    }
    try {
      const amenity = await this.AmenityRepository.findOneById(id);
      for (const room of amenity.rooms) {
        await this.RoomRepository.update(room._id, {
          $pull: { amenities: id },
        });
      }
      await this.AmenityRepository.softDelete(id);
      return { message: 'Deleted', code: 200 };
    } catch (error) {
      console.log(error);
    }
  }
  async searchRoom(name) {
    if (typeof name !== 'string') {
      return { message: 'Invalid name', code: 400 };
    }

    try {
      let query = {};
      if (name && name.length > 0) {
        query = {
          name: {
            $regex: name,
            $options: 'i', // Tùy chọn 'i' để tìm kiếm không phân biệt hoa thường
          },
        };
      }

      const rooms = await this.RoomRepository.findAllWithPopulate(
        query,
        'roomType',
      );

      return { message: 'OK', code: 200, ...rooms };
    } catch (error) {
      return error;
    }
  }
  async editAmenity(payload) {
    const { name, id } = payload;
    if (!name) {
      return { message: 'Invalid Input', code: 400 };
    }
    const amenity = await this.AmenityRepository.findOneById(id);
    if (!amenity) {
      return { message: 'Amenity Not Found', code: 400 };
    } else {
      await this.AmenityRepository.update(id, { name });
      return { message: 'Edited', code: HttpStatus.OK };
    }
  }
  async getRoomTypeById(id: string) {
    if (!id) {
      return { message: 'Invalid Input', code: 400 };
    }
    const roomType = await this.RoomTypeRepository.findOneById(id);
    if (!roomType) {
      return { message: 'Room Type not found', code: 400 };
    }
    return { message: 'OK', code: 200, roomType };
  }
  async EditRoomTypeById(payload) {
    const { title, name, description, path, inclusion, id } = payload;
    if (
      !title ||
      !name ||
      !description ||
      !path ||
      !id ||
      !inclusion ||
      inclusion?.length < 1
    ) {
      return { message: 'Invalid Input', code: 400 };
    }
    try {
      const checkRoomTypeExist = await this.RoomTypeRepository.findOneById(id);
      if (!checkRoomTypeExist) {
        return { message: 'Room Type not found', code: 400 };
      }
      await this.RoomTypeRepository.update(id, {
        title,
        name,
        description,
        path,
        inclusion,
      });
      return { message: 'Edited', code: 200 };
    } catch (error) {
      return error;
    }
  }
  async getRoomById(id) {
    if (!id) {
      return { message: 'Invalid Input', code: 400 };
    }
    try {
      const room = await this.RoomRepository.findOneById(id);
      return {
        message: 'OK',
        code: 200,
        room,
      };
    } catch (error) {
      return error;
    }
  }
  async editRoomById(payload) {
    const {
      id,
      name,
      description,
      size,
      roomType,
      amenities,
      price,
      max_adults,
      max_children,
    } = payload;
    const checkRoomTypeExist = await this.RoomTypeRepository.findOneById(
      roomType,
    );
    if (!checkRoomTypeExist) {
      return { message: 'RoomType not found', code: 400 };
    }
    const checkRoomExist = await this.RoomRepository.findOneById(id);
    if (!checkRoomExist) {
      return { message: 'Room not found', code: 400 };
    }
    try {
      const pullRoom = await this.RoomTypeRepository.update(
        checkRoomExist.roomType?._id,
        {
          $pull: { rooms: checkRoomExist._id },
        },
      );
      const pushNewRoom = await this.RoomTypeRepository.updateList(roomType, {
        rooms: id,
      });
      const updateRoom = await this.RoomRepository.update(id, {
        name,
        description,
        slug: this.slugify(name),
        size,
        roomType,
        amenities,
        max_adults,
        max_children,
      });
      return { message: 'Edited', code: 200 };
    } catch (error) {
      return error;
    }
  }
  async getAmenityById(id) {
    if (!id) {
      return { message: 'Invalid Input', code: 400 };
    }
    const amenity = await this.AmenityRepository.findOneById(id);
    return { message: 'OK', code: 200, amenity };
  }
}
