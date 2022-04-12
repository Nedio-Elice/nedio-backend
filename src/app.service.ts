import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const d: Date = new Date();
    return `date: ${d}`;
  }
}
