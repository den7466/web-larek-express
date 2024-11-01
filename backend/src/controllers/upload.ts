import { Request, Response, NextFunction } from 'express';
import InternalServerError from '../errors/internal-server-error';
import BadRequestError from '../errors/bad-request-error';
import { UPLOAD_PATH } from '../config';

const postUploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;

    if (!file) {
      return next(new BadRequestError('Ошибка запроса'));
    }

    const originalFileName = file.originalname.split('.');
    const fileName = `${file.filename}.${originalFileName[1]}`;

    return res.status(200).send({
      fileName: `/${UPLOAD_PATH}/${fileName}`,
      originalName: file.filename,
    });
  } catch (error) {
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
};

export default postUploadFile;
