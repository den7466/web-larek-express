import uploadFile from '../middlewares/file';
import { postUploadFole } from '../controllers/upload';
import { Router } from 'express';


const router = Router();

router.post('/', uploadFile, postUploadFole);

export default router;