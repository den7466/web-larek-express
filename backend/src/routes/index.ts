import { Router } from 'express';
import productsRouter from './product';
import ordersRouter from './order';
import authRouter from './auth';
import uploadRouter from './upload';
import otherPages from '../controllers/other';

const router = Router();

router.use('/upload', uploadRouter);
router.use('/product', productsRouter);
router.use('/order', ordersRouter);
router.use('/auth', authRouter);

router.use('*', otherPages);

export default router;