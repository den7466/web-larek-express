import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AUTH_ACCESS_TOKEN_SECRET } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';

const ACCESS_TOKEN = {
  secret: AUTH_ACCESS_TOKEN_SECRET,
};

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default async (req: SessionRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }

  const accessToken = extractBearerToken(authorization);

  let payload;
  try {
    payload = await jwt.verify(accessToken, ACCESS_TOKEN.secret);
  } catch (err) {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }

  req.user = payload;
  return next();
};
