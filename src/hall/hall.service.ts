import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hall, HallDocument } from './schema/hall.schema';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Injectable()
export class HallService {
  constructor(@InjectModel(Hall.name) private hallModel: Model<HallDocument>) {}

  async getAllHalls(): Promise<Hall[]> {
    return await this.hallModel.find().exec();
  }

  async getHallById(hallObjectId: string): Promise<Hall> {
    return await this.hallModel.findOne({ _id: hallObjectId });
  }

  async createHall(hallData: CreateHallDto): Promise<Hall> {
    return await this.hallModel.create({ ...hallData });
  }

  async updateHallById(
    hallObjectId: string,
    hallUpdateData: UpdateHallDto,
  ): Promise<any> {
    return await this.hallModel
      .where({ _id: hallObjectId })
      .updateOne(hallUpdateData);
  }

  async deleteHallById(hallObjectId: string): Promise<any> {
    return await this.hallModel.deleteOne({ _id: hallObjectId });
  }

  async getHallByGalleryId(galleryObjectId: string): Promise<any> {
    return await this.hallModel.find({ galleryId: galleryObjectId });
  }

  async deleteHallByGalleryId(galleryObjectId: string): Promise<any> {
    return await this.hallModel.deleteMany({ galleryId: galleryObjectId });
  }
}
