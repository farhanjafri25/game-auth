import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game-module/game.module';
import { GameSchema } from './model/game.model';
import { QuestionSchema } from './model/question.model';
import { UserSchema } from './model/user.model';
import { UserModule } from './user-module/user.module';

@Module({
  imports: [MongooseModule.forRoot(`mongodb+srv://farhanjafri:farhanjafriMongo25@cluster0.sjhpikb.mongodb.net/game`),
    MongooseModule.forFeature([
      { name: "game_score_data", schema: GameSchema},
      { name: "questions_data", schema: QuestionSchema}
  ]), UserModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
