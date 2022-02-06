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

  async getUserOwnGalleries(userObjectId: string): Promise<Gallery[]> {
    return await this.galleryModel.find({ authorId: userObjectId });
  }

  async getOnesPerCategory() {
    const galleries = [];
    const date = new Date();
    const categories = [
      '예술',
      '건축',
      '문화',
      '자연',
      '저널리즘',
      '동물',
      '인물',
      '패션',
    ];

    for (let i = 0; i < categories.length; i++) {
      const gallery = await this.galleryModel
        .find({
          category: categories[i],
          startDate: { $lte: date },
          endDate: { $gte: date },
        })
        .sort({ startDate: 1 })
        .limit(1);
      galleries.push(gallery[0]);
    }
    return galleries;
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
        category: { $regex: category, $options: 'i' },
        title: { $regex: title, $options: 'i' },
        nickname: { $regex: nickname, $options: 'i' },
      })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return filteredGallery;
  }

  async getUpcomingGallery() {
    const date = new Date(); // 오늘 날짜 확인
    const upcomings = await this.galleryModel
      .find({ startDate: { $gt: date } }) // 갤러리 오픈 날짜가 오늘 이후인 것들만 가져옴
      .sort({ startDate: 1 }) // 가져온 것들 중 오픈 날짜가 임박한 것들만 가져옴
      .limit(4);
    return upcomings;
  }

  async getTodaysGallery() {
    const date = new Date();
    const randoms = [];
    const randomGalleries = [];
    const totalCount = await this.galleryModel
      .find({
        startDate: { $lte: date },
        endDate: { $gte: date },
      })
      .count();

    const todaysGalleries = await this.galleryModel.find({
      startDate: { $lte: date },
      endDate: { $gte: date },
    });

    for (let i = 0; i < 8; i++) {
      // 오픈 중인 것 중 랜덤으로 갤러리 가져오기
      const random = Math.floor(Math.random() * totalCount);
      if (randoms.indexOf(random) < 0) {
        randoms.push(random);
        randomGalleries.push(todaysGalleries[random]);
      } else i -= 1;
    }

    return randomGalleries;
  }

  async getGalleryById(galleryObjectId: string): Promise<Gallery> {
    return await this.galleryModel.findOne({ _id: galleryObjectId });
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
