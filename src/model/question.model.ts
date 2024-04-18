import * as mongoose from 'mongoose';

//Question model in mongoose
export const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});
//Question interface for input validation
export interface QuestionInterface {
  id: string;
  questionText: string;
  options: number;
  correctAnswer: string;
}
