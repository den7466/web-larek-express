import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { faker } from '@faker-js/faker';
import InternalServerError from '../errors/internal-server-error';
import BadRequestError from '../errors/bad-request-error';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;
  try{

    if(items.length === 0 || !Array.isArray(items)){
      return next(new BadRequestError('Ошибка валидации данных при создании заказа'));
    }

    const checkResult = await Product.find({
      _id: { $in: items },
      price: { $ne: null}
    });

    if(checkResult.length !== items.length){
      return next(new BadRequestError('Ошибка валидации данных при создании заказа'));
    }

    let totalResult = 0;
    for(const item of checkResult){
      totalResult += item.price;
    }

    if(totalResult !== total){
      return next(new BadRequestError('Ошибка валидации данных при создании заказа'));
    }

    const orderId = faker.string.uuid();

    res.status(201).send({
      id: orderId,
      total: totalResult
    });

  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}