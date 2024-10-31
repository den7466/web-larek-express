import { Router } from 'express';
import { getProducts, createProduct, patchProduct, deleteProduct } from '../controllers/product';
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/validations';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);

router.post('/', auth, validateCreateProduct, createProduct);

router.patch('/:id', auth, validateUpdateProduct, patchProduct);

router.delete('/:id', auth, deleteProduct);

export default router;