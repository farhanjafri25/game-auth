import * as mongoose from 'mongoose';
//Create user score schema for mongoDb
export const GameSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  score: { type: Number, required: true },
  gameId: { type: String, required: true },
});

//Interface for user input validation
export interface GameScore {
  id: string;
  userId: string;
  score: number;
  gameId: string;
}
