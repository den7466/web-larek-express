import { NextFunction, Request, Response } from 'express';
import NotFoundError from '../errors/not-found-error';

const otherPages = (_req: Request, _res: Response, next: NextFunction) => next(new NotFoundError('Ресурс не найден'));

export default otherPages;
