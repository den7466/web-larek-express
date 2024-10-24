import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = (req: Request, res: Response) => {
  return Product.find({})
    .then((products) => res.status(200).send({ items: products, total: products.length }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createProduct = (req: Request, res: Response) => {
  res.status(201).send({
    "description": "Будет стоять над душой и не давать прокрастинировать.",
    "image": {
        fileName: "/images/Asterisk_2.png",
        originalName: "Asterisk_2.png"
    },
    "title": "Мамка-таймер",
    "category": "софт-скил",
    "price": null
 });
}