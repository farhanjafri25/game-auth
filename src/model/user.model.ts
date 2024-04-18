import * as mongoose from 'mongoose';
//User schema in MongoDb
export const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
//Interface for validation
export interface User {
  userId: string;
    email: string;
    password: string;
}
