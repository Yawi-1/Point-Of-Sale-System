import  {Router} from 'express'
import { login, register,checkAuth } from '../controllers/authController.js';
const router = Router();

router.post('/register',register)
router.post('/login',login)
router.get('/me',checkAuth)

export default router;