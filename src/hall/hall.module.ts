import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { Hall, HallSchema } from './schema/hall.schema';
import { GalleryModule } from '../gallery/gallery.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hall.name, schema: HallSchema }]),
    forwardRef(() => GalleryModule),
  ],
  controllers: [HallController],
  providers: [HallService],
  exports: [HallService],
})
export class HallModule {}
