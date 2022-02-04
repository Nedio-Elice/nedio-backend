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
} from '@nestjs/common';
import { Gallery } from './schema/gallery.schema';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { HallService } from '../hall/hall.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../user/user.service';

// 현재 hallMoudle은 appModule이 아닌 galleryModule에 붙어있는 형태(hall에 관한 모든 서비스가 gallery controller에서 실행되기 때문).
@Controller('galleries')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly hallService: HallService,
    private readonly userService: UserService,
  ) {}

  @Get() // 모든 Gallery 데이터 조회
  async getAllGalleries(): Promise<Gallery[]> {
    return await this.galleryService.getAllGalleries();
  }

  @Get(':id') // 특정 Gallery 데이터 조회
  async getGalleryById(
    @Res({ passthrough: true }) res: any,
    @Param('id') galleryObjectId: string,
  ) {
    try {
      const newHallsData: Array<{
        hallId: any;
        hallName: string;
      }> = [];
      const gallery = await this.galleryService.getGalleryById(galleryObjectId);
      const halls = await this.hallService.getHallByGalleryId(galleryObjectId);
      const user = await this.userService.getUserByObjectId(
        String(gallery.authorId),
      );

      for (let i = 0; i < halls.length; i++) {
        const { _id, hallName } = halls[i];
        newHallsData.push({ hallId: _id, hallName: hallName });
      }

      res.status(200).json({
        success: true,
        message: 'Get Gallery',
        data: {
          authorId: String(gallery.authorId),
          author: {
            email: user.email,
            nickname: user.nickname,
            contact: user.contact,
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
      res.status(400).json({
        success: false,
        message: 'failed Get Gallery',
      });
    }
  }

  @Get('upcoming')
  async getUpcomingGallery() {
    return true;
  }
  @UseGuards(JwtAuthGuard)
  @Post() // Gallery 데이터 생성
  async createGallery(
    @Request() req,
    @Body() galleryData: any,
    @Res({ passthrough: true }) res: any,
  ) {
    // 현재 api 목록을 보면 hall 데이터가 gallery 생성 api에 필요한 데이터에 포함되어 있음. 이를 분리해서 hall을 생성
    const authorId = req.user.id;
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
      title,
      category,
      startDate,
      endDate,
      description,
      posterUrl,
    };
    try {
      // return으로 생성한 정보를 줌. _id도 같이. (result._id로 galleryId 접근, result.authorId로 author 접근)
      const result = await this.galleryService.createGallery({
        ...newGallery,
        gallery: newGallery,
      });

      // gallery를 만들며 hall도 같이 생성(api 문서에선 gallery생성시 hall도 같이 생성하게 되어있음)
      for (let i = 0; i < halls.length; i++) {
        const { hallName, imagesData } = halls[i];
        const newHall = { galleryId: result._id, hallName, imagesData };
        await this.hallService.createHall({ ...newHall, hall: newHall });
      }

      res.status(200).json({
        success: true,
        message: 'Created Gallery',
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id') // Gallery 데이터 수정
  async updateGalleryById(
    @Request() req,
    @Param('id') galleryObjectId: string,
    @Body() updateGalleryData: any,
    @Res({ passthrough: true }) res: any,
  ) {
    try {
      const authorId = await this.galleryService.getAuthorId(galleryObjectId); // author의 objectId. string 형태가 아님

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
          authorId,
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
          const { hallName, hallObjectId, imagesData } = halls[i];
          const newHall = { galleryId: galleryObjectId, hallName, imagesData };
          await this.hallService.updateHallById(hallObjectId, {
            ...newHall,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Updated Gallery',
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        message: 'failed Updating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // Gallery 데이터 삭제
  async deleteGalleryById(
    @Request() req,
    @Param('id') galleryObjectId: string,
    @Res({ passthrough: true }) res: any,
  ) {
    try {
      const authorId = await this.galleryService.getAuthorId(galleryObjectId);

      if (req.user.id === String(authorId)) {
        await this.hallService.deleteHallByGalleryId(galleryObjectId); // hall 부터 삭제
        await this.galleryService.deleteGalleryById(galleryObjectId);

        res.status(200).json({
          success: true,
          message: 'delete gallery success.',
        });
      } else {
        res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        message: 'failed Updating Gallery',
      });
    }
    //return this.galleryService.deleteGalleryById(galleryObjectId);
  }
}
