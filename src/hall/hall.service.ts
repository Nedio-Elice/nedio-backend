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
    return await this.hallModel.findOne({ _id: hallObjectId }); // 이 부분에서 email이랑 id랑 헷갈릴 수 있는데 어떻게 할지 나중에 논의해봐야할 듯
  }

  async createHall(hallData: CreateHallDto): Promise<Hall> {
    return await this.hallModel.create({ ...hallData }); // 만약 유저 생성에서 추가해줘야할 것이 있을 경우 이 부분에서 추가
  }

  async updateHallById(
    hallObjectId: string,
    hallUpdateData: UpdateHallDto,
  ): Promise<boolean> {
    try {
      await this.hallModel
        .where({ _id: hallObjectId })
        .updateOne(hallUpdateData);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteHallById(hallObjectId: string): Promise<boolean> {
    try {
      await this.hallModel.deleteOne({ _id: hallObjectId });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getHallByGalleryId(galleryObjectId: string): Promise<any> {
    return await this.hallModel.find({ galleryId: galleryObjectId });
  }

  async deleteHallByGalleryId(galleryObjectId: string): Promise<boolean> {
    try {
      await this.hallModel.deleteMany({ galleryId: galleryObjectId });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
