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
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GalleryService } from '../gallery/gallery.service';
@Controller('halls')
export class HallController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly hallService: HallService,
  ) {}

  @Get(':id')
  async getHallById(@Param('id') hallObjectId: string, @Res() res: any) {
    try {
      const hall = await this.hallService.getHallById(hallObjectId);
      return res.status(200).json({
        success: true,
        message: 'get hall success.',
        data: {
          galleryId: String(hall.galleryId),
          hallName: hall.hallName,
          hallTheme: hall.hallTheme,
          imagesData: hall.imagesData,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'error occured in progress.',
      });
    }
  }

  @Post()
  async createHall(@Body() hallData: CreateHallDto) {
    return await this.hallService.createHall(hallData);
  }

  @Put(':id')
  async updateHallById(
    @Param('id') hallObjectId: string,
    @Body() updateHallData: UpdateHallDto,
  ) {
    return this.hallService.updateHallById(hallObjectId, updateHallData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteHallById(
    @Request() req,
    @Param('id') hallObjectId: string,
    @Res() res: any,
  ) {
    try {
      const hall = await this.hallService.getHallById(hallObjectId);
      const gallery = await this.galleryService.getGalleryById(
        String(hall.galleryId),
      );
      if (req.user.id === String(gallery.authorId)) {
        await this.hallService.deleteHallById(hallObjectId);
        return res.status(200).json({
          success: true,
          message: 'delete hall success.',
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'not allowed method.',
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'error occured in progress.',
      });
    }
  }
}
