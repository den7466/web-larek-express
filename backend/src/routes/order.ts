import { Router } from 'express';
import { createOrder } from '../controllers/order';
import { validateProduct } from '../middlewares/validations'

const router = Router();

router.post('/', createOrder);

export default router;