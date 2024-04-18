import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { GameController } from './controllers/game.controller';
import { GameRepository } from './repositories/game.repository';
import { GameService } from './services/game.service';
import { AppGateway } from './socketController/socket.gateway';
import { UserModule } from '../user-module/user.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from '../strategies';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema } from '../model/question.model';
import { GameSchema } from '../model/game.model';
import * as path from 'path';
import * as dotenv from 'dotenv';

const envPath = path.join(
  process.cwd(),
  process.env.NODE_ENV ? `envs/.env.${process.env.NODE_ENV}` : `/.env`,
);
dotenv.config({
  path: envPath,
});

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
    }),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: 'questions_data', schema: QuestionSchema },
      { name: 'game_score_data', schema: GameSchema },
    ]),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    GameRepository,
    JwtStrategy,
    AppGateway,
    AccessTokenStrategy,
  ],
  exports: [
    GameService,
    GameRepository,
    JwtStrategy,
    AppGateway,
    AccessTokenStrategy,
  ],
})
export class GameModule {}
