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
  galleryId: Gallery;

  @Prop({ required: true })
  hallName: string;

  @Prop({ required: true })
  hallTheme: string;

  @Prop()
  imagesData: {
    imageTitle: string;
    imageUrl: string;
    imageDescription: string;
    width: number;
    height: number;
  }[];
}

export const HallSchema = SchemaFactory.createForClass(Hall);
