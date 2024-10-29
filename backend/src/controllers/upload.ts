import path from 'path';
import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';
import InternalServerError from '../errors/internal-server-error';

export const postUploadFole = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const file = req.file;

    if (!file) {
      res.status(400).send('Нет файла');
      return;
    }

    // console.log(file);

    const date = new Date();
    const originalFileName = file.originalname.split('.');
    const fileName = file.filename+
                      '_'+date.getDate()+
                      '-'+(Number(date.getMonth())+1)+
                      '-'+date.getFullYear()+
                      '-'+date.getHours()+
                      '-'+date.getMinutes()+
                      '-'+date.getSeconds()+'.'+originalFileName[1];

    await fs.copyFile(file.path, path.join(__dirname, '../public/images', fileName));

    res.status(200).send({
      "fileName": `/images/${fileName}`,
      "originalName": file.originalname
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}