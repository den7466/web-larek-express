import { validateRegister } from '../middlewares/validations';
import { getLogout, getToken, getCurrentUser, postLoginUser, postRegisterUser } from '../controllers/auth';
import { Router } from 'express';


const router = Router();

router.post('/login', postLoginUser);
router.post('/register', validateRegister, postRegisterUser);
router.get('/token', getToken);
router.get('/logout', getLogout);
router.get('/user', getCurrentUser);

export default router;

