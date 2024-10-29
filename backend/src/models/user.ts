import mongoose from 'mongoose';
import Joi from "joi";

interface IToken {
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: true
  }
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false
  },
  tokens: {
    type: [tokenSchema],
    select: false
  }
});

export const userRegisterValidateSchema = Joi.object<IUser>({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  tokens: Joi.array().items(Joi.object({
    token: Joi.string().required()
  }))
});

export default mongoose.model<IUser>('user', userSchema);