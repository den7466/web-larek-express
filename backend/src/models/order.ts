import Joi from "joi";

enum Payment {
  'card',
  'online'
}

export interface IOrder {
  payment: Payment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const orderValidateSchema = Joi.object<IOrder>({
  payment: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().required()
});