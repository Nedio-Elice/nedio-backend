import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getCommentsByGalleryId(
    galleryObjectId: string,
    page: number,
    perPage: number,
  ): Promise<{ count: number; comments: any }> {
    const count = await this.commentModel.count({ galleryId: galleryObjectId });
    const comments = await this.commentModel
      .find({ galleryId: galleryObjectId })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });
    return { count: count, comments: comments };
  }

  async getAuthorIdByCommentObjectId(commentObjectId: string): Promise<string> {
    const comment = await this.commentModel.findOne({ _id: commentObjectId });
    return String(comment.authorId);
  }

  async createComment(commentData: CreateCommentDto): Promise<any> {
    return await this.commentModel.create({ ...commentData });
  }

  async updateCommentById(
    commentObjectId: string,
    commentUpdateData: UpdateCommentDto,
  ): Promise<any> {
    return await this.commentModel
      .where({ _id: commentObjectId })
      .updateOne(commentUpdateData);
  }

  async deleteCommentById(commentObjectId: string): Promise<any> {
    return await this.commentModel.deleteOne({ _id: commentObjectId });
  }
}
