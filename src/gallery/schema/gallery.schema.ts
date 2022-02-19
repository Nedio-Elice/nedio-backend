import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import * as mongoose from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ versionKey: false })
export class Gallery {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: User;

  @Prop()
  nickname: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  description: string;

  @Prop()
  posterUrl: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
