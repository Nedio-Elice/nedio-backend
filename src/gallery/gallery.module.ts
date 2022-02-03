import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { Gallery, GallerySchema } from './schema/gallery.schema';
import { HallModule } from '../hall/hall.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    HallModule,
    UserModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
