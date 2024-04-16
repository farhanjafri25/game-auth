import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  score: { type: Number, required: true },
  gameId: { type: String, required: true },
});

export interface GameScore {
  id: string;
  userId: string;
  score: number;
  gameId: string;
}
