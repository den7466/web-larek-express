import { Router } from 'express';
import uploadFile from '../middlewares/file';
import postUploadFile from '../controllers/upload';
import auth from '../middlewares/auth';

const router = Router();

router.post('/', auth, uploadFile, postUploadFile);

export default router;
