import { NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

const otherPages = (next: NextFunction) => next(new NotFoundError('Ресурс не найден'));

export default otherPages;
