import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
} from '@nestjs/common';
import { Gallery } from './schema/gallery.schema';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('galleries')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get() // 모든 Gallery 데이터 조회
  async getAllGalleries(): Promise<Gallery[]> {
    return await this.galleryService.getAllGalleries();
  }

  @Get(':id') // 특정 Gallery 데이터 조회
  async getGalleryById(@Param('id') galleryObjectId: string): Promise<Gallery> {
    return await this.galleryService.getGalleryById(galleryObjectId);
  }

  @Post() // Gallery 데이터 생성
  async createGallery(@Body() galleryData: CreateGalleryDto) {
    return await this.galleryService.createGallery(galleryData);
  }

  @Put(':id') // Gallery 데이터 수정
  async updateGalleryById(
    @Param('id') galleryObjectId: string,
    @Body() updateGalleryData: UpdateGalleryDto,
  ) {
    return this.galleryService.updateGalleryById(
      galleryObjectId,
      updateGalleryData,
    );
  }

  @Delete(':id') // Gallery 데이터 삭제
  async deleteGalleryById(@Param('id') galleryObjectId: string) {
    return this.galleryService.deleteGalleryById(galleryObjectId);
  }
}
