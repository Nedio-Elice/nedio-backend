import { IsOptional, IsString, IsArray } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Hall } from '../schema/hall.schema';
export class CreateHallDto {
  @IsObjectId()
  readonly galleryId: string;

  @IsString()
  readonly hallName: string;

  @IsString()
  readonly hallTheme: string;

  @IsArray()
  readonly imagesData: string;

  @IsOptional()
  readonly hall: Hall;
}
