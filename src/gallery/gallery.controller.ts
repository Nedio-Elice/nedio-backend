import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
  UseGuards,
  Request,
  Res,
  Query,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { HallService } from '../hall/hall.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';
@Controller('galleries')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly hallService: HallService,
    private readonly userService: UserService,
  ) {}

  @Get('filtering') // 검색조건에 해당하는 갤러리 조회
  async getFilteredGalleries(
    @Res() res: any,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('category') category: string,
    @Query('title') title: string,
    @Query('nickname') nickname: string,
  ) {
    try {
      const galleries = await this.galleryService.getFilteredGalleries(
        page,
        perPage,
        category,
        title,
        nickname,
      );

      return res.status(200).json({
        success: true,
        message: 'get galleries filtered success',
        data: galleries,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Get filtered Gallery',
      });
    }
  }

  @Get('getOnesPerCategory')
  async getOnesPerCategory(@Res() res: any) {
    try {
      const galleries = await this.galleryService.getOnesPerCategory();

      return res.status(200).json({
        success: true,
        message: 'get galleries per category success',
        data: galleries,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'get galleries per category failed',
      });
    }
  }

  @Get('preview/:code') // code로 전시 예정, 오픈 중인 갤러리 가져오는 것이 달라짐
  async getUpcomingGallery(@Res() res: any, @Param('code') code: string) {
    try {
      let galleries: any;
      if (code === 'upcoming')
        galleries = await this.galleryService.getUpcomingGallery();
      else if (code === 'todays')
        galleries = await this.galleryService.getTodaysGallery();

      const results: {
        _id: string;
        posterUrl: string;
        description: string;
        endDate: string;
        startDate: string;
        category: string;
        title: string;
        nickname: string;
        authorId: string;
      }[] = [];

      for (let i = 0; i < galleries.length; i++) {
        const {
          _id,
          posterUrl,
          description,
          endDate,
          startDate,
          category,
          title,
          nickname,
          authorId,
        } = galleries[i];

        results.push({
          _id,
          posterUrl,
          description,
          endDate,
          startDate,
          category,
          title,
          nickname,
          authorId,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'get previewed galleries success',
        data: results,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Get previewed Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('myGallery')
  async getMyGallery(@Request() req, @Res() res) {
    try {
      const authorId = req.user.id;
      const galleries = await this.galleryService.getUserOwnGalleries(authorId);
      return res.status(200).json({
        success: true,
        message: 'sucess get my own Gallery',
        data: galleries,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed get my own Gallery',
      });
    }
  }

  @Get(':id')
  async getGalleryById(@Res() res: any, @Param('id') galleryObjectId: string) {
    try {
      const newHallsData: Array<{
        hallObjectId: any;
        hallName: string;
        hallTheme: string;
        imagesData: Array<{
          imageTitle: string;
          imageDescription: string;
          imageUrl: string;
          width: number;
          height: number;
        }>;
      }> = [];
      const gallery = await this.galleryService.getGalleryById(galleryObjectId);
      const halls = await this.hallService.getHallByGalleryId(galleryObjectId);
      const user = await this.userService.getUserByObjectId(
        String(gallery.authorId),
      );
      for (let i = 0; i < halls.length; i++) {
        const { _id, hallName, hallTheme, imagesData } = halls[i];
        newHallsData.push({
          hallObjectId: _id,
          hallName: hallName,
          hallTheme: hallTheme,
          imagesData: imagesData,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'getGalleryById success',
        data: {
          authorId: String(gallery.authorId),
          author: {
            email: user.email,
            nickname: user.nickname,
            profileURL: user.profileURL,
          },
          title: gallery.title,
          category: gallery.category,
          startDate: gallery.startDate,
          endDate: gallery.endDate,
          description: gallery.description,
          posterUrl: gallery.posterUrl,
          halls: newHallsData,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'getGalleryById failed',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGallery(
    @Request() req,
    @Body() galleryData: any,
    @Res() res: any,
  ) {
    const authorId = req.user.id;
    const nickname = req.user.nickname;
    const {
      title,
      category,
      startDate,
      endDate,
      description,
      posterUrl,
      halls,
    } = galleryData;

    const newGallery = {
      authorId,
      nickname,
      title,
      category,
      startDate,
      endDate,
      description,
      posterUrl,
    };
    try {
      const result = await this.galleryService.createGallery({
        ...newGallery,
        gallery: newGallery,
      });

      for (let i = 0; i < halls.length; i++) {
        const { hallName, hallTheme, imagesData } = halls[i];
        const newHall = {
          galleryId: result._id,
          hallName,
          hallTheme,
          imagesData,
        };
        await this.hallService.createHall({ ...newHall, hall: newHall });
      }

      return res.status(200).json({
        success: true,
        message: 'Created Gallery',
        data: result._id,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateGalleryById(
    @Request() req,
    @Param('id') galleryObjectId: any,
    @Body() updateGalleryData: any,
    @Res() res: any,
  ) {
    try {
      const authorId = await this.galleryService.getAuthorId(galleryObjectId);

      if (req.user.id === String(authorId)) {
        const {
          title,
          category,
          startDate,
          endDate,
          description,
          posterUrl,
          halls,
        } = updateGalleryData;

        const newGallery = {
          title,
          category,
          startDate,
          endDate,
          description,
          posterUrl,
        };

        await this.galleryService.updateGalleryById(galleryObjectId, {
          ...newGallery,
        });

        for (let i = 0; i < halls.length; i++) {
          const { hallName, hallObjectId, hallTheme, imagesData } = halls[i];
          const newHall = {
            galleryId: galleryObjectId,
            hallName: hallName,
            hallTheme: hallTheme,
            imagesData: imagesData,
          };
          if (hallObjectId) {
            await this.hallService.updateHallById(hallObjectId, {
              ...newHall,
            });
          } else {
            await this.hallService.createHall({ ...newHall, hall: newHall });
          }
        }

        return res.status(200).json({
          success: true,
          message: 'Updated Gallery',
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Updating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteGalleryById(
    @Request() req,
    @Param('id') galleryObjectId: string,
    @Res() res: any,
  ) {
    try {
      const authorId = await this.galleryService.getAuthorId(galleryObjectId);

      if (req.user.id === String(authorId)) {
        await this.hallService.deleteHallByGalleryId(galleryObjectId); // hall 부터 삭제
        await this.galleryService.deleteGalleryById(galleryObjectId);

        return res.status(200).json({
          success: true,
          message: 'delete gallery success.',
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Updating Gallery',
      });
    }
  }
}
