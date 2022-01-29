import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // 그냥 /api로만 들어올경우 해당 컨트롤러가 통제
  getHello(): string {
    return this.appService.getHello();
  }
}
