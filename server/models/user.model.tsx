import mongoose from 'mongoose';

export const User = mongoose.model(
  'User',
  new mongoose.Schema({
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
      minlength: 8,
      select: false,
    },
  })
);
