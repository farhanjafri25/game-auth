import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export interface User {
  userId: string;
    email: string;
    password: string;
}
