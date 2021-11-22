import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  mfaEnabled: boolean;
  mfaSecretKey: string;
}

const UserSchema: Schema<User> = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Please add an Email'],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'Please use a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  mfaEnabled: {
    type: Boolean,
    required: true,
  },
  mfaSecretKey: {
    type: String,
    default: '',
  },
});

export default mongoose.model('User', UserSchema);
