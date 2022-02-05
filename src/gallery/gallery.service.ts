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

  // 갤러리의 작성자 반환
  async getAuthorId(galleryObjectId: any): Promise<any> {
    const gallery = await this.galleryModel.findOne({ _id: galleryObjectId });
    return gallery.authorId;
  }
  async getAllGalleries(): Promise<Gallery[]> {
    return await this.galleryModel.find().exec();
  }

  async getFilteredGalleries(
    page: number,
    perPage: number,
    category: string,
    title: string,
    nickname: string,
  ): Promise<Gallery[]> {
    const filteredGallery = await this.galleryModel
      .find({
        // 1차 필터링
        category: category,
        title: { $regex: title, $options: 'i' },
        nickname: { $regex: nickname, $options: 'i' },
      })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return filteredGallery;
  }

  async getGalleryById(galleryObjectId: string): Promise<Gallery> {
    return await this.galleryModel.findOne({ _id: galleryObjectId }); // 이 부분에서 email이랑 id랑 헷갈릴 수 있는데 어떻게 할지 나중에 논의해봐야할 듯
  }

  async createGallery(galleryData: CreateGalleryDto) {
    const { startDate, endDate } = galleryData;
    const openDate: Date = new Date(startDate);
    const closeDate: Date = new Date(endDate);
    return await this.galleryModel.create({
      startDate: openDate,
      endDate: closeDate,
      ...galleryData,
    }); // 만약 유저 생성에서 추가해줘야할 것이 있을 경우 이 부분에서 추가
  }

  async updateGalleryById(
    galleryObjectId: string,
    galleryUpdateData: UpdateGalleryDto,
  ): Promise<any> {
    return await this.galleryModel
      .where({ _id: galleryObjectId })
      .updateOne(galleryUpdateData);
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
