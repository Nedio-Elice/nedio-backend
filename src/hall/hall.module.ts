import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { Hall, HallSchema } from './schema/hall.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hall.name, schema: HallSchema }]),
  ],
  controllers: [HallController],
  providers: [HallService],
  exports: [HallService],
})
export class HallModule {}
