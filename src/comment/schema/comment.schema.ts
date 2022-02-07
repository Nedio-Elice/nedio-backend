import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gallery } from '../../gallery/schema/gallery.schema';
import { User } from '../../user/schema/user.schema';

import * as mongoose from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ versionKey: false })
export class Comment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  })
  galleryId: Gallery; // 포함된 갤러리 id, 얘 참조로 바꿔야함

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User; // 생성한 유저 id, 얘 참조로 바꿔야함

  @Prop()
  content: string; // 방명록 내용
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
