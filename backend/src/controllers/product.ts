import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

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

export const getProductById = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('OK');
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { title, image, category, description, price } = req.body;

    const createResult = await Product.create({ title, image, category, description, price });

    res.status(201).send({
      description: createResult.description,
      image: createResult.image,
      title: createResult.title,
      category: createResult.category,
      price: createResult.price,
      id: createResult._id
    });
  }catch(error){
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Ошибка при создании товара с уже существующим полем title'));
    }
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const patchProduct = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Обновлено');
}

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Удалено');
}