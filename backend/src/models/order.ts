import Joi from 'joi';

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
  payment: Joi.string()
    .required()
    .messages({
      'string.base': 'Способ должен быть текстом',
      'string.empty': 'Способ не может быть пустым',
      'any.required': 'Способ обязателен',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email должен быть текстом',
      'string.empty': 'Email не может быть пустым',
      'string.email': 'Email имеет недопустимые значения',
      'any.required': 'Email обязателен',
    }),
  phone: Joi.string()
    .required()
    .messages({
      'string.base': 'Номер телефона должен быть текстом',
      'string.empty': 'Номер телефона не может быть пустым',
      'any.required': 'Номер телефона обязателен',
    }),
  address: Joi.string()
    .required()
    .messages({
      'string.base': 'Адрес должен быть текстом',
      'string.empty': 'Адрес не может быть пустым',
      'any.required': 'Адрес обязателен',
    }),
  total: Joi.number()
    .required()
    .messages({
      'number.base': 'Поле итого должно быть числом',
      'any.required': 'Поле итого обязательно',
    }),
  items: Joi.array()
    .required()
    .messages({
      'array.base': 'Должен быть передан массив',
      'any.required': 'Список продуктов обязателен',
    }),
});
