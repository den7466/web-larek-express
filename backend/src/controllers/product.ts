import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';

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

// В контроллере POST-запроса на создание товара /product перед сохранением пути
// до файла в базу переместите сам файл из временной папки в постоянную.

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

// Так же как и при создании товара, при обновлении,
// если было передано поле image, необходимо перенести картинку
// из временной папки в постоянную.
// TODO: можно валидировать данные но отдельной схемой
export const patchProduct = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { id } = req.params;
    const { description, image, title, category, price } = req.body;

    const resultFindProduct = await Product.findOne({_id: id});
    if(!resultFindProduct){
      return next(new NotFoundError('Данные не найдены'));
    }

    const resultUpdateProduct = await Product.updateOne({_id: id}, {description, image, title, category, price});

    if(resultUpdateProduct.modifiedCount === 0){
      return next(new InternalServerError('Внутренняя ошибка сервера'));
    }

    res.status(200).send({
      "success": true,
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}

export const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  try{
    res.status(200).send({
      "image": {
          "fileName": "/images/Mithosis.png",
          "originalName": "Mithosis.png"
      },
      "_id": "66601ac957ecac94459696e8",
      "title": "Бэкенд-антистресс",
      "category": "другое",
      "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
      "price": 1000
    });
  }catch(error){
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
}