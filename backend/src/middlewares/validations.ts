import { celebrate, Joi, errors, Segments } from 'celebrate';
import { IProduct } from '../models/product';
import { orderSchema } from '../models/order';

export const validateProduct = celebrate({
  [Segments.BODY]: Joi.object<IProduct>({
    title: Joi.string().min(2).max(30).required().messages({
      'string.base': 'Заголовок должен быть текстом',
      'string.empty': 'Заголовок не может быть пустым',
      'string.min': 'Заголовок должен быть длиной не менее {#limit} си символов',
      'string.max': 'Заголовок не может превышать {#limit} символов',
      'any.required': 'Заголовок обязателен',
    }),
  }),
});

export const validateOrder = celebrate({
  [Segments.BODY]: orderSchema
});