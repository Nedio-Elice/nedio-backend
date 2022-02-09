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
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id') // 특정 갤러리의 모든 Comment 데이터 조회
  async getCommentsByGalleryId(
    @Param('id') galleryObjectId: string,
    @Res() res: any,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    try {
      const parsedComments = [];
      const { count, comments } =
        await this.commentService.getCommentsByGalleryId(
          galleryObjectId,
          page,
          perPage,
        );
      for (let i = 0; i < comments.length; i++) {
        const { _id, content, authorId, galleryId } = comments[i];
        const { nickname, profileURL } = await (
          await comments[i].populate('authorId')
        ).authorId;

        const authorInfo = {
          nickname: nickname,
          id: authorId,
          profileURL: profileURL,
        };
        parsedComments.push({
          _id: _id,
          content: content,
          author: authorInfo,
          galleryId: galleryId,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'get comments success',
        count: count,
        data: parsedComments,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed getting comments',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post() // Comment 데이터 생성
  async createComment(
    @Request() req,
    @Body() commentData: any,
    @Res() res: any,
  ) {
    try {
      const { content, galleryId } = commentData; // body에서 내용물, 갤러리 id 받아옴
      const authorId = req.user.id; // 헤더의 jwt 토큰에서 작성자 id 받아옴
      const newComment = { galleryId, authorId, content };
      await this.commentService.createComment({
        ...newComment,
        comment: newComment,
      });

      return res.status(201).json({
        success: true,
        message: 'Create comment success',
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id') // Comment 데이터 수정
  async updateCommentById(
    @Request() req,
    @Param('id') commentObjectId: string,
    @Body() updateCommentData: any,
    @Res() res: any,
  ) {
    try {
      const authorId = await this.commentService.getAuthorIdByCommentObjectId(
        commentObjectId,
      );
      if (req.user.id === String(authorId)) {
        await this.commentService.updateCommentById(
          commentObjectId,
          updateCommentData,
        );

        return res.status(200).json({
          success: true,
          message: 'update comment success',
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: not the author',
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id') // Comment 데이터 삭제
  async deleteCommentById(
    @Request() req,
    @Param('id') commentObjectId: string,
    @Res() res: any,
  ) {
    try {
      const authorId = await this.commentService.getAuthorIdByCommentObjectId(
        commentObjectId,
      );
      if (req.user.id === String(authorId)) {
        await this.commentService.deleteCommentById(commentObjectId);
        return res.status(200).json({
          success: true,
          message: 'delete comment success',
        });
      } else {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: not the author',
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: 'failed Creating Gallery',
      });
    }
  }
}
