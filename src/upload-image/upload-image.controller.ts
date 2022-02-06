import 'dotenv/config';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';

@Controller('uploadImage')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post()
  async uploadFile(@Req() req, @Res() res) {
    try {
      await this.uploadImageService.uploadImage(req, res);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'failed upload image',
      });
    }
  }
}
