import mongoose from 'mongoose';
import Joi from "joi";

interface Iimage {
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

const imagesSchema = new mongoose.Schema<Iimage>({
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

export const productValidateSchema = Joi.object<IProduct>({
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
});

export default mongoose.model<IProduct>('product', productSchema);