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

  async getCommentById(commentObjectId: string) {
    return await this.commentModel.findOne({ _id: commentObjectId }); // 이 부분에서 email이랑 id랑 헷갈릴 수 있는데 어떻게 할지 나중에 논의해봐야할 듯
  }

  async createComment(commentData: CreateCommentDto) {
    return await this.commentModel.create({ ...commentData }); // 만약 유저 생성에서 추가해줘야할 것이 있을 경우 이 부분에서 추가
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
