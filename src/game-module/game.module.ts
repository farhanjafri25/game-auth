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

@Module({
  imports: [
    JwtModule.register({
      secret: 'JwtSecret',
    }),
        UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
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
