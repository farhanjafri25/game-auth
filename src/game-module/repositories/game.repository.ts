import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionInterface } from 'src/model/question.model';
import { Model } from 'mongoose';
import { GameScore } from '../../model/game.model';

@Injectable()
export class GameRepository {
  constructor(
    @InjectModel('questions_data')
    private readonly questionModel: Model<QuestionInterface>,
    @InjectModel('game_score_data')
    private readonly gameScoreModel: Model<GameScore>,
  ) {}

  async getQuestions(page: number, pageSize: number = 1) {
    const res = await this.questionModel
      .find()
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    console.log('GameRepository ~ getQuestions ~ res:', res);
    return res;
  }

  async getQuestionById(questionId: string) {
    try {
      const res = await this.questionModel.findOne({ _id: questionId });
      console.log('GameRepository ~ getQuestionById ~ res:', res);
      return res;
    } catch (error) {
      console.log('GameRepository ~ getQuestionById ~ error:', error);
      return null;
    }
  }
    async saveGameScore(userId: string, roomId: string, score: number) {
        try {
            const scoreObj = new this.gameScoreModel({
                userId,
                score,
                gameId: roomId
            });
            const result = await scoreObj.save();
            console.log("GameRepository ~ saveGameScore ~ result:", result);
            return;
        } catch (error) {
            console.log("GameRepository ~ saveGameScore ~ error:", error);
            return null;
        }
    }
}
