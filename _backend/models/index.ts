import mongoose from 'mongoose';
import User from './user.model';

mongoose.Promise = global.Promise;

const db = {
  mongoose: mongoose,
  user: User,
};

export default db;
