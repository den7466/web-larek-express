import 'dotenv/config';
import InternalServerError from '../errors/internal-server-error';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import User from '../models/user';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictError from '../errors/conflict-error';
const bcrypt = require('bcryptjs');

const { AUTH_REFRESH_TOKEN_EXPIRY, AUTH_SECRET } = process.env;

// TODO: Проверить правильность работы токенов, в базе они не просто так

export const postLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try{
    const user = await User.findOne({email: email}).select('+password');

    if(!user){
      return next(new UnauthorizedError('Неправильная почта или пароль'));
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
      return next(new UnauthorizedError('Неправильная почта или пароль'));
    }

    const accessToken = jwt.sign({ _id: user._id }, AUTH_SECRET || 'secret_key', { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, AUTH_SECRET || 'secret_key', { expiresIn: '7d'});

    const resultCreateToken = await User.updateOne({_id: user._id}, {$set: {tokens: [{token: refreshToken}]}});

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
      path: '/',
    } as CookieOptions);

    res.status(200).send({
      "user": {
        "email": user.email,
        "name": user.name
      },
      "success": true,
      "accessToken": accessToken,
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const postRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { name, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: encryptedPassword
    });

    const accessToken = jwt.sign({ _id: user._id }, AUTH_SECRET || 'secret_key', { expiresIn: '10m' });
    const refreshToken = jwt.sign({ _id: user._id }, AUTH_SECRET || 'secret_key', { expiresIn: '7d'});

    const resultCreateToken = await User.updateOne({_id: user._id}, {$set: {tokens: [{token: refreshToken}]}});

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
      path: '/',
    } as CookieOptions);

    res.status(200).send({
      "user": {
        "email": user.email,
        "name": user.name
      },
      "success": true,
      "accessToken": accessToken,
    });
  }catch(error){
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Ошибка при создании пользователя с уже существующим полем email'));
    }
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const getToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.cookies;

  try{
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const accessToken = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = await jwt.verify(accessToken, AUTH_SECRET || 'secret_key');
    } catch (err) {
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const user = await User.findOne({_id: payload});
    const newAccessToken = jwt.sign({ _id: user?._id }, AUTH_SECRET || 'secret_key', { expiresIn: '10m' });
    const newRefreshToken = jwt.sign({ _id: user?._id }, AUTH_SECRET || 'secret_key', { expiresIn: '7d'});

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
      path: '/',
    } as CookieOptions);

    res.status(200).send({
      "user": {
        "email": user?.email,
        "name": user?.name
      },
      "success": true,
      "accessToken": newAccessToken,
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const getLogout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  try{
    const resultDeleteToken = await User.updateOne({tokens: {$elemMatch: {token: refreshToken}}}, {tokens: []});
    res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: ms('-1d'),
          path: '/',
        } as CookieOptions);
    res.status(200).send({
      "success": true,
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try{
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const accessToken = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = await jwt.verify(accessToken, AUTH_SECRET || 'secret_key');
    } catch (err) {
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const user = await User.findOne({_id: payload});

    res.status(200).send({
      "user": {
          "email": user?.email,
          "name": user?.name
      },
      "success": true,
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}