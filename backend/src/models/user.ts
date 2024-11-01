import mongoose, { ObjectId } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_SECRET,
} from '../config';

const crypto = require('crypto-js');
const bcrypt = require('bcryptjs');

const ACCESS_TOKEN = {
  secret: AUTH_ACCESS_TOKEN_SECRET,
  expiry: AUTH_ACCESS_TOKEN_EXPIRY,
};

const REFRESH_TOKEN = {
  secret: AUTH_REFRESH_TOKEN_SECRET,
  expiry: AUTH_REFRESH_TOKEN_EXPIRY,
};

interface IToken {
  token: string;
}

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

interface userModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<any>;
  generateAcessToken: (user: IUser) => string;
  generateRefreshToken: (user: IUser) => string;
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  tokens: {
    type: [tokenSchema],
    select: false,
  },
});

export const userRegisterValidateSchema = Joi.object<IUser>({
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.base': 'Имя должно быть текстом',
      'string.empty': 'Имя не может быть пустым',
      'string.min': 'Имя должно быть длиной не менее {#limit} символов',
      'string.max': 'Имя не может превышать {#limit} символов',
      'any.required': 'Имя обязательно',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email должен быть текстом',
      'string.empty': 'Email не может быть пустым',
      'string.email': 'Email имеет недопустимые значения',
      'any.required': 'Email обязателен',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Пароль должен быть текстом',
      'string.empty': 'Пароль не может быть пустым',
      'string.min': 'Пароль должен быть длиной не менее {#limit} символов',
      'any.required': 'Пароль обязателен',
    }),
  tokens: Joi.array().items(Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'string.base': 'Токен должен быть строкой',
        'string.empty': 'Токен не может быть пустым',
        'any.required': 'Токен обязателен',
      }),
  }).messages({
    'array.base': 'Должен быть передан массив',
  })),
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const userModel: any = this;

  const user = await userModel.findOne({ email }).select('+password');

  if (!user) {
    return null;
  }

  const passwdMatch = await bcrypt.compare(password, user.password);

  if (!passwdMatch) {
    return null;
  }

  return user;
});

userSchema.static('generateAcessToken', (user: IUser) => {
  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    },
  );

  return accessToken;
});

userSchema.static('generateRefreshToken', async function generateRefreshToken(user: IUser) {
  const userModel: any = this;

  const refreshToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    REFRESH_TOKEN.secret,
    {
      expiresIn: REFRESH_TOKEN.expiry,
    },
  );

  const rTknHash = crypto.HmacSHA256(refreshToken, REFRESH_TOKEN.secret);

  await userModel.updateOne(
    { _id: user._id },
    { $set: { tokens: [{ token: rTknHash.toString() }] } },
  );
  return refreshToken;
});

export default mongoose.model<IUser, userModel>('user', userSchema);
