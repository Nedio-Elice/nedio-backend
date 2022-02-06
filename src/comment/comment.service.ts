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

  async getAllComments(): Promise<Comment[]> {
    return await this.commentModel.find().exec();
  }

  async getCommentsByGalleryId(
    galleryObjectId: string,
    page: number,
    perPage: number,
  ) {
    const count = await this.commentModel.count({ galleryId: galleryObjectId });
    console.log(count);
    const comments = await this.commentModel
      .find({ galleryId: galleryObjectId })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { count: count, comments: comments };
  }

  async getAuthorIdByCommentObjectId(commentObjectId: string) {
    const comment = await this.commentModel.findOne({ _id: commentObjectId });
    return String(comment.authorId);
  }

  async createComment(commentData: CreateCommentDto) {
    return await this.commentModel.create({ ...commentData });
  }

  async updateCommentById(
    commentObjectId: string,
    commentUpdateData: UpdateCommentDto,
  ) {
    try {
      await this.commentModel
        .where({ _id: commentObjectId })
        .updateOne(commentUpdateData);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async deleteCommentById(commentObjectId: string) {
    try {
      await this.commentModel.deleteOne({ _id: commentObjectId });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
