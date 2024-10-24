import { Request, Response } from 'express';
import Product from '../models/product';



export const createOrder = async (req: Request, res: Response) => {
  const { payment, email, phone, address, total, items } = req.body;
  if(items.length <= 0){
    return res.status(400).send('Ошибка запроса');
  }

  let itemsExist = false;
  let itemsArray = [];
  let saleExist = false;
  for await (const item of items) {
    const result = await Product.findById(item);
    if(result) {
      itemsExist = true;
      itemsArray.push(result);
    }else{
      itemsExist = false;
      break;
    }
  }
  if(await itemsExist){
    for(const item of itemsArray) {
      if(item.price > 0){
        saleExist = true;
      }else{
        saleExist = false;
        break;
      }
    }
  }

  // Валидацию сделать через joi попробовать




  // res.status(201).send({payment, email, phone, address, total ,items});
}