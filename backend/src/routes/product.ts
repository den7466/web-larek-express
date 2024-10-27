import { Router } from 'express';
import { getProducts, createProduct, patchProduct, deleteProduct, getProductById } from '../controllers/product';
import { validateProduct } from '../middlewares/validations';

const router = Router();

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post('/', validateProduct, createProduct);

router.patch('/:id', patchProduct);

router.delete('/:id', deleteProduct);

export default router;