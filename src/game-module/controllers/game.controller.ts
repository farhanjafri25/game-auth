import { Controller, Post } from '@nestjs/common';
import { GetCurrentUser } from 'src/decorators/currentUser.decorator';
import { GameService } from '../services/game.service';

@Controller()
export class GameController {
  constructor(private GameService: GameService) {}

  @Post('/game/start')
  async functionStartGame(@GetCurrentUser('userId') userId: any) {
      const res = await this.GameService.createRoom(userId);
      return res;
  }
}
