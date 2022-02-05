import { Module } from '@nestjs/common';
import { UploadImageController } from './upload-image.controller';
import { UploadImageService } from './upload-image.service';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService],
  exports: [UploadImageService],
})
export class UploadImageModule {}
