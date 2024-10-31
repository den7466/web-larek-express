import { celebrate, Segments } from 'celebrate';
import { createProductValidateSchema, updateProductValidateSchema } from '../models/product';
import { orderValidateSchema } from '../models/order';
import { userRegisterValidateSchema } from '../models/user';

export const validateCreateProduct = celebrate({
  [Segments.BODY]: createProductValidateSchema
});

export const validateUpdateProduct = celebrate({
  [Segments.BODY]: updateProductValidateSchema
});

export const validateOrder = celebrate({
  [Segments.BODY]: orderValidateSchema
});

export const validateRegister = celebrate({
  [Segments.BODY]: userRegisterValidateSchema
});