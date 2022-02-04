import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
  UseGuards,
  Res,
  Request,
} from '@nestjs/common';
import { Comment } from './schema/comment.schema';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post() // Gallery 데이터 생성
  async createGallery(
    @Request() req,
    @Body() commentData: any,
    @Res({ passthrough: true }) res: any,
  ) {
    try {
      const { content, galleryId } = commentData;
      const authorId = req.user.id;
      const newComment = { galleryId, authorId, content };
      await this.commentService.createComment({
        ...newComment,
        comment: newComment,
      });

      res.status(201).json({
        success: true,
        message: 'Create comment success',
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id') // Gallery 데이터 수정
  async updateGalleryById(
    @Request() req,
    @Param('id') commentObjectId: string,
    @Body() updateCommentData: UpdateCommentDto,
    @Res({ passthrough: true }) res: any,
  ) {
    try {
      //if (req.user.id === String(authorId))
      return this.commentService.updateCommentById(
        commentObjectId,
        updateCommentData,
      );
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // Gallery 데이터 삭제
  async deleteGalleryById(
    @Request() req,
    @Param('id') commentObjectId: string,
    @Res({ passthrough: true }) res: any,
  ) {
    try {
      //if (req.user.id === String(authorId))
      return this.commentService.deleteCommentById(commentObjectId);
    } catch (e) {
      console.log(e);
      res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }
}
