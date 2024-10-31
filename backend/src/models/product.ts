import mongoose from 'mongoose';
import Joi from "joi";
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
}

const imagesSchema = new mongoose.Schema<IImage>({
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true
  },
  image: {
    type: imagesSchema,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: null
  }
});

export const createProductValidateSchema = Joi.object<IProduct>({
  title: Joi.string().min(2).max(30).required(),
  image: Joi.object({
    fileName: Joi.string(),
    originalName: Joi.string(),
  }).required(),
  category: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
  // .messages({
  //   'string.base': 'Заголовок должен быть текстом',
  //   'string.empty': 'Заголовок не может быть пустым',
  //   'string.min': 'Заголовок должен быть длиной не менее {#limit} си символов',
  //   'string.max': 'Заголовок не может превышать {#limit} символов',
  //   'any.required': 'Заголовок обязателен',
  // }),
  // TODO: Тут с сообщениями разобраться
});

export const updateProductValidateSchema = Joi.object<IProduct>({
  title: Joi.string().min(2).max(30),
  image: Joi.object({
    fileName: Joi.string(),
    originalName: Joi.string(),
  }),
  category: Joi.string(),
  description: Joi.string(),
  price: Joi.number()
});

productSchema.static('deleteRelatedFiles', function deleteRelatedFiles(image: any) {
  if(image.fileName.length !== 0){
    fs.access(path.join(__dirname, `../public/${image.fileName}`), constants.F_OK)
    .then(() => {
      fs.unlink(path.join(__dirname, `../public/${image.fileName}`));
    }).catch(() => {});
  }
});

export default mongoose.model<IProduct, ProductModel>('product', productSchema);