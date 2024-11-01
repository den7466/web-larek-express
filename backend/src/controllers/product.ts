import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import copyFile from './copy-file';
import BadRequestError from '../errors/bad-request-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await Product.find({});
    return res.status(200).send({ items: result, total: result.length });
  } catch (error) {
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      image,
      category,
      description,
      price,
    } = req.body;

    if (image && Object.keys(image).length !== 0) {
      copyFile(image);
    }

    const createResult = await Product.create({
      title,
      image,
      category,
      description,
      price,
    });

    return res.status(201).send({
      description: createResult.description,
      image: createResult.image,
      title: createResult.title,
      category: createResult.category,
      price: createResult.price,
      id: createResult._id,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Ошибка при создании товара с уже существующим полем title'));
    }
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
};

export const patchProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      description,
      image,
      title,
      category,
      price,
    } = req.body;

    const resultValidateId = Product.isValidObjectID(id);
    if (!resultValidateId) {
      return next(new BadRequestError('Ошибка запроса'));
    }

    const resultFindProduct = await Product.findOne({ _id: id });
    if (!resultFindProduct) {
      return next(new NotFoundError('Данные не найдены'));
    }

    const resultUpdateProduct = await Product.findOneAndUpdate(
      { _id: id },
      {
        description,
        image,
        title,
        category,
        price,
      },
      { new: true },
    );

    if (image && Object.keys(image).length !== 0) {
      copyFile(image);
      Product.deleteRelatedFiles(resultFindProduct.image);
    }

    if (!resultUpdateProduct) {
      return next(new InternalServerError('Внутренняя ошибка сервера'));
    }

    return res.status(200).send({
      description: resultUpdateProduct.description,
      image: resultUpdateProduct.image,
      title: resultUpdateProduct.title,
      category: resultUpdateProduct.category,
      price: resultUpdateProduct.price,
      id: resultUpdateProduct._id,
    });
  } catch (error) {
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const resultValidateId = Product.isValidObjectID(id);
    if (!resultValidateId) {
      return next(new BadRequestError('Ошибка запроса'));
    }

    const resultFindProduct = await Product.findOne({ _id: id });
    if (!resultFindProduct) {
      return next(new NotFoundError('Данные не найдены'));
    }

    const resultDeleteProduct = await Product.deleteOne({ _id: id });

    if (resultDeleteProduct.deletedCount !== 0) {
      Product.deleteRelatedFiles(resultFindProduct.image);
    }

    return res.status(200).send({
      image: resultFindProduct.image,
      _id: id,
      title: resultFindProduct.title,
      category: resultFindProduct.category,
      description: resultFindProduct.description,
      price: resultFindProduct.price,
    });
  } catch (error) {
    return next(new InternalServerError('Внутренняя ошибка сервера'));
  }
};
