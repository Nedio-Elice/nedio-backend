import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import * as mongoose from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema()
export class Gallery {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User; // 갤러리 생성한 유저 id, 얘 참조로 바꿔야함

  @Prop({ required: true })
  title: string; // 전시 제목

  @Prop({ required: true })
  category: string; // 전시 카테고리(종류)

  @Prop({ required: true })
  startDate: Date; // 전시 시작일

  @Prop({ required: true })
  endDate: Date; // 전시 종료일

  @Prop()
  description: string; // 전시 설명

  @Prop()
  posterUrl: string; // 전시 썸네일 이미지 주소
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
