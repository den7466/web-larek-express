import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
  try{
    return Product.find({})
    .then((products) => res.status(200).send({ items: products, total: products.length }))
    .catch((error) => {
      return next(new InternalServerError('Внутренняя ошибка сервера'));
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  try{
    res.status(201).send({
      "description": "Будет стоять над душой и не давать прокрастинировать.",
      "image": {
          fileName: "/images/Asterisk_2.png",
          originalName: "Asterisk_2.png"
      },
      "title": "Мамка-таймер",
      "category": "софт-скил",
      "price": null
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}