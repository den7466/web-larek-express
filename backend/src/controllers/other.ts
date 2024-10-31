import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

const otherPages = (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError('Ресурс не найден'));
}

export default otherPages;