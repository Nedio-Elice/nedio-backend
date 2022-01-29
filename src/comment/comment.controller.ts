import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
} from '@nestjs/common';
import { Comment } from './schema/comment.schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get() // 모든 Gallery 데이터 조회
  async getAllGalleries(): Promise<Comment[]> {
    return await this.commentService.getAllComments();
  }

  @Get(':id') // 특정 Gallery 데이터 조회
  async getGalleryById(@Param('id') commentObjectId: string): Promise<Comment> {
    return await this.commentService.getCommentById(commentObjectId);
  }

  @Post() // Gallery 데이터 생성
  async createGallery(@Body() commentData: CreateCommentDto) {
    return await this.commentService.createComment(commentData);
  }

  @Put(':id') // Gallery 데이터 수정
  async updateGalleryById(
    @Param('id') commentObjectId: string,
    @Body() updateCommentData: UpdateCommentDto,
  ) {
    return this.commentService.updateCommentById(
      commentObjectId,
      updateCommentData,
    );
  }

  @Delete(':id') // Gallery 데이터 삭제
  async deleteGalleryById(@Param('id') commentObjectId: string) {
    return this.commentService.deleteCommentById(commentObjectId);
  }
}
