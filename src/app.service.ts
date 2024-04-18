import { Injectable } from '@nestjs/common';
import { Public } from './decorators';

@Injectable()
export class AppService {
  @Public()
  getHello(): string {
    return 'Hello World!';
  }
}
