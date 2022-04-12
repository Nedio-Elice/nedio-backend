import { IsOptional, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { Comment } from '../schema/comment.schema';

export class CreateCommentDto {
  @IsObjectId()
  readonly galleryId: string;

  @IsObjectId()
  readonly authorId: string;

  @IsString()
  readonly content: string;

  @IsOptional()
  readonly comment: Comment;
}
