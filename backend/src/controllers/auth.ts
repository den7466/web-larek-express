import 'dotenv/config';
import InternalServerError from '../errors/internal-server-error';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
import User from '../models/user';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import { AUTH_REFRESH_TOKEN_EXPIRY, AUTH_REFRESH_TOKEN_SECRET } from '../config';
const bcrypt = require('bcryptjs');
const crypto = require("crypto-js");

const REFRESH_TOKEN = {
  secret: AUTH_REFRESH_TOKEN_SECRET,
  cookie: {
      name: "refreshToken",
      options: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY),
        path: '/',
      } as CookieOptions,
  },
};

interface SessionRequest extends Request {
  user?: string | JwtPayload | any;
}

export const postLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try{
    const user = await User.findUserByCredentials(email, password);

    if(!user){
      return next(new UnauthorizedError('Неправильная почта или пароль'));
    }

    const accessToken = await User.generateAcessToken(user);
    const refreshToken = await User.generateRefreshToken(user);

    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    res.status(200).send({
      user: {
        email: user.email,
        name: user.name
      },
      success: true,
      accessToken,
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

    const accessToken = await User.generateAcessToken(user);
    const refreshToken = await User.generateRefreshToken(user);

    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    res.status(200).send({
      user: {
        email: user.email,
        name: user.name
      },
      success: true,
      accessToken,
    });
  }catch(error){
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Ошибка при создании пользователя с уже существующим полем email'));
    }
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { refreshToken } = req.cookies;

    if (!refreshToken){
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const rTknHash = crypto.HmacSHA256(refreshToken, REFRESH_TOKEN.secret);

    let payload;

    try {
      payload = await jwt.verify(
        refreshToken,
        REFRESH_TOKEN.secret
      );
    } catch (err) {
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const user = await User.findOne({
      _id: payload,
      'tokens.token': rTknHash,
    });

    if(!user){
      return next(new UnauthorizedError('Ошибка авторизации'));
    }

    const newAccessToken = await User.generateAcessToken(user);

    res.status(200)
      .set({ "Cache-Control": "no-store", Pragma: "no-cache" })
      .send({
        user: {
          email: user.email,
          name: user.name
        },
        success: true,
        accessToken: newAccessToken,
      });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const getLogout = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { refreshToken } = req.cookies;

    const rTknHash = crypto.HmacSHA256(refreshToken, REFRESH_TOKEN.secret);

    const resultDeleteToken = await User.updateOne({tokens: {$elemMatch: {token: rTknHash.toString()}}}, {tokens: []});
    if(resultDeleteToken.modifiedCount === 0){
      return next(new BadRequestError('Ошибка запроса'));
    }

    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        maxAge: new Date(1),
      }
    );

    res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, expireCookieOptions);

    res.status(200).send({
      success: true,
    });
  }catch(error){
    return next(new InternalServerError(`Внутренняя ошибка сервера: ${error}`));
  }
}

export const getCurrentUser = async (req: SessionRequest, res: Response, next: NextFunction) => {
  try{

    const user = await User.findOne({_id: req.user._id});

    if(!user){
      return next(new NotFoundError('Объект не найден'));
    }

    res.status(200).send({
      user: {
        email: user.email,
        name: user.name
      },
      success: true,
    });
  }catch(error){
      return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}