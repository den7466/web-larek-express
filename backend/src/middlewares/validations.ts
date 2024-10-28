import { celebrate, Segments } from 'celebrate';
import { productValidateSchema } from '../models/product';
import { orderValidateSchema } from '../models/order';
import { userRegisterValidateSchema } from '../models/user';

export const validateProduct = celebrate({
  [Segments.BODY]: productValidateSchema
});

export const validateOrder = celebrate({
  [Segments.BODY]: orderValidateSchema
});

export const validateRegister = celebrate({
  [Segments.BODY]: userRegisterValidateSchema
});