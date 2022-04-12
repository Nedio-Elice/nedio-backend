import { IsOptional, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Gallery } from '../schema/gallery.schema';

export class CreateGalleryDto {
  @IsObjectId()
  readonly authorId: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly startDate: string;

  @IsString()
  readonly endDate: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly posterUrl: string;

  @IsOptional()
  readonly gallery: Gallery;
}
