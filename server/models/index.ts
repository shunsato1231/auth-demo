import mongoose from 'mongoose';
import { User } from './user.model';

mongoose.Promise = global.Promise;

export const db = {
  mongoose: mongoose,
  user: User,
};
