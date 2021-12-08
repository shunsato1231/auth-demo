import { IUser, regex } from '@entities';
import mongoose, { Schema, Document } from 'mongoose';

const UserSchema: Schema<IUser & Document> = new Schema({
  _id: Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    required: [true, 'Please add an Email'],
    match: [regex.email, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  mfaEnabled: {
    type: Boolean,
    required: [true, 'Please set a mfaEnabled flag'],
  },
  mfaSecretKey: {
    type: String,
    default: '',
  },
});

export const UserModel = mongoose.model('User', UserSchema);
