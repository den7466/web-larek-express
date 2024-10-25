import { Request, Response } from 'express';
import Product from '../models/product';
import { faker } from '@faker-js/faker';

export const createOrder = async (req: Request, res: Response) => {
  const { payment, email, phone, address, total, items } = req.body;
  try{

    if(items.length === 0 || !Array.isArray(items)){
      throw new Error('Ошибка валидации данных при создании товара');
    }

    const checkResult = await Product.find({
      _id: { $in: items },
      price: { $ne: null}
    });

    if(checkResult.length !== items.length){
      throw new Error('Ошибка валидации данных при создании товара');
    }

    let totalResult = 0;
    for(const item of checkResult){
      totalResult += item.price;
    }

    if(totalResult !== total){
      throw new Error('Ошибка валидации данных при создании товара');
    }

    res.status(201).send({
      id: faker.helpers.multiple(() => faker.string.uuid(), {count: 1})[0],
      total: totalResult
    });

  }catch(error){
    res.status(500).send(`Ошибка запроса`);
  }
}