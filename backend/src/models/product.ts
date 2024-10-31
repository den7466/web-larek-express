import mongoose from 'mongoose';
import Joi from 'joi';
import path from 'path';
import fs, { constants } from 'fs/promises';

export interface IImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: object;
  category: string;
  description: string;
  price: number;
}

interface ProductModel extends mongoose.Model<IProduct> {
  deleteRelatedFiles: (image: any) => void;
  isValidObjectID: (id: string) => boolean;
}

const imagesSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  image: {
    type: imagesSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export const createProductValidateSchema = Joi.object<IProduct>({
  title: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.base': 'Заголовок должен быть текстом',
      'string.empty': 'Заголовок не может быть пустым',
      'string.min': 'Заголовок должен быть длиной не менее {#limit} символов',
      'string.max': 'Заголовок не может превышать {#limit} символов',
      'any.required': 'Заголовок обязателен',
    }),
  image: Joi.object({
    fileName: Joi.string()
      .required()
      .messages({
        'string.base': 'Имя файла должно быть текстом',
        'string.empty': 'Имя файла не может быть пустым',
        'any.required': 'Имя файла обязателено',
      }),
    originalName: Joi.string()
      .required()
      .messages({
        'string.base': 'Оригинальное имя файла должно быть текстом',
        'string.empty': 'Оригинальное имя файла не может быть пустым',
        'any.required': 'Оригинальное имя файла обязателено',
      }),
  })
    .required()
    .messages({
      'object.base': 'Должен быть передан объект',
    }),
  category: Joi.string()
    .required()
    .messages({
      'string.base': 'Категория должна быть текстом',
      'string.empty': 'Категория не может быть пустой',
      'any.required': 'Категория обязательна',
    }),
  description: Joi.string()
    .messages({
      'string.base': 'Описание должно быть текстом',
    }),
  price: Joi.number().messages({
    'number.base': 'Цена должна быть числом',
  }),
});

export const updateProductValidateSchema = Joi.object<IProduct>({
  title: Joi.string()
    .min(2)
    .max(30)
    .messages({
      'string.base': 'Заголовок должен быть текстом',
      'string.min': 'Заголовок должен быть длиной не менее {#limit} символов',
      'string.max': 'Заголовок не может превышать {#limit} символов',
    }),
  image: Joi.object({
    fileName: Joi.string()
      .required()
      .messages({
        'string.base': 'Имя файла должно быть текстом',
        'string.empty': 'Имя файла не может быть пустым',
        'any.required': 'Имя файла обязателено',
      }),
    originalName: Joi.string()
      .required()
      .messages({
        'string.base': 'Оригинальное имя файла должно быть текстом',
        'string.empty': 'Оригинальное имя файла не может быть пустым',
        'any.required': 'Оригинальное имя файла обязателено',
      }),
  }),
  category: Joi.string()
    .messages({
      'string.base': 'Категория должна быть текстом',
    }),
  description: Joi.string()
    .messages({
      'string.base': 'Описание должно быть текстом',
    }),
  price: Joi.number()
    .messages({
      'number.base': 'Цена должна быть числом',
    }),
});

productSchema.static('deleteRelatedFiles', (image: any) => {
  if (image.fileName.length !== 0) {
    fs.access(path.join(__dirname, `../public/${image.fileName}`), constants.F_OK).then(() => {
      fs.unlink(path.join(__dirname, `../public/${image.fileName}`));
    }).catch(() => {});
  }
});

productSchema.static('isValidObjectID', (id: string) => {
  const len = id.length;
  let valid = false;
  if (len === 12 || len === 24) {
    valid = /^[0-9a-fA-F]+$/.test(id);
  }
  return valid;
});

export default mongoose.model<IProduct, ProductModel>('product', productSchema);
