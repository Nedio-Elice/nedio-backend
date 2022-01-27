import { IsOptional, IsString, IsDate } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id'; // mongoDB _id 용 validator
import { Gallery } from '../schema/gallery.schema';

export class CreateGalleryDto {
  @IsObjectId()
  readonly authorId: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly openDate: string;

  @IsString()
  readonly closeDate: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly posterUrl: string;

  @IsOptional()
  readonly gallery: Gallery;
}
