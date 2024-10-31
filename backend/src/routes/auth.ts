import { validateRegister } from '../middlewares/validations';
import { getLogout, refreshAccessToken, getCurrentUser, postLoginUser, postRegisterUser } from '../controllers/auth';
import { Router } from 'express';
import auth from '../middlewares/auth';


const router = Router();

router.post('/login', postLoginUser);
router.post('/register', validateRegister, postRegisterUser);
router.get('/token', refreshAccessToken);
router.get('/logout', getLogout);
router.get('/user', auth, getCurrentUser);

export default router;

