import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gallery } from '../../gallery/schema/gallery.schema';
import * as mongoose from 'mongoose';

export type HallDocument = Hall & Document;

@Schema({ versionKey: false })
export class Hall {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  })
  galleryId: Gallery; // 포함된 갤러리 id, 얘 참조로 바꿔야함

  @Prop({ required: true })
  hallName: string; // 관 이름

  @Prop()
  imagesData: {
    imageTitle: string;
    imageUrl: string;
    imageDescription;
    string;
  }[]; // 이미지데이터({사진경로, 사진설명})
}

export const HallSchema = SchemaFactory.createForClass(Hall);
