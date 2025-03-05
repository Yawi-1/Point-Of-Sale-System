import  {Router} from 'express'
import { login, register,checkAuth,getAllUsers } from '../controllers/authController.js';
import {authenticate} from '../middlewares/authenticate.js'
const router = Router();

router.post('/register',register)
router.post('/login',login)
router.get('/me',checkAuth)
router.get('/allUsers',authenticate,getAllUsers)

export default router;