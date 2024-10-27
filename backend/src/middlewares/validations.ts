import { celebrate, Segments } from 'celebrate';
import { productValidateSchema } from '../models/product';
import { orderValidateSchema } from '../models/order';

export const validateProduct = celebrate({
  [Segments.BODY]: productValidateSchema
});

export const validateOrder = celebrate({
  [Segments.BODY]: orderValidateSchema
});