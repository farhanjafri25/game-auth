import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../jwt.strategy";
import { GameController } from "./controllers/game.controller";
import { GameRepository } from "./repositories/game.repository";
import { GameService } from "./services/game.service";
import { AppGateway } from "./socketController/socket.gateway";
import { UserModule } from "../user-module/user.module";

@Module({
    imports: [JwtModule.register({
        secret: 'JwtSecret'
    }), UserModule],
    controllers: [GameController],
    providers: [GameService, GameRepository, JwtStrategy, AppGateway],
    exports: [GameService, GameRepository, JwtStrategy, AppGateway]
})
export class GameModule {}