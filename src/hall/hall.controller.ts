import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Put,
} from '@nestjs/common';
import { Hall } from './schema/hall.schema';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) {}

  @Get() // 모든 Hall 데이터 조회
  async getAllHalls(): Promise<Hall[]> {
    return await this.hallService.getAllHalls();
  }

  @Get(':id') // 특정 Hall 데이터 조회
  async getHallById(@Param('id') hallObjectId: string): Promise<Hall> {
    return await this.hallService.getHallById(hallObjectId);
  }

  @Post() // Hall 데이터 생성
  async createHall(@Body() hallData: CreateHallDto) {
    return await this.hallService.createHall(hallData);
  }

  @Put(':id') // Hall 데이터 수정
  async updateHallById(
    @Param('id') hallObjectId: string,
    @Body() updateHallData: UpdateHallDto,
  ) {
    return this.hallService.updateHallById(hallObjectId, updateHallData);
  }

  @Delete(':id') // Hall 데이터 삭제
  async deleteHallById(@Param('id') hallObjectId: string) {
    return this.hallService.deleteHallById(hallObjectId);
  }
}
