import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gallery, GalleryDocument } from './schema/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
  ) {}

  async getAllGalleries(): Promise<Gallery[]> {
    return await this.galleryModel.find().exec();
  }

  async getGalleryById(galleryObjectId: string) {
    return await this.galleryModel.findOne({ _id: galleryObjectId }); // 이 부분에서 email이랑 id랑 헷갈릴 수 있는데 어떻게 할지 나중에 논의해봐야할 듯
  }

  async createGallery(galleryData: CreateGalleryDto) {
    const { openDate, closeDate } = galleryData;
    const newOpenDate: Date = new Date(openDate);
    const newCloseDate: Date = new Date(closeDate);
    return await this.galleryModel.create({
      openDate: newOpenDate,
      closeDate: newCloseDate,
      ...galleryData,
    }); // 만약 유저 생성에서 추가해줘야할 것이 있을 경우 이 부분에서 추가
  }

  async updateGalleryById(
    galleryObjectId: string,
    galleryUpdateData: UpdateGalleryDto,
  ) {
    try {
      await this.galleryModel
        .where({ _id: galleryObjectId })
        .updateOne(galleryUpdateData);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteGalleryById(galleryObjectId: string) {
    try {
      await this.galleryModel.deleteOne({ _id: galleryObjectId });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
