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
  galleryId: Gallery;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop()
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
