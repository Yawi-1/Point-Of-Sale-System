import  {Router} from 'express'
import { login, register,checkAuth,getAllUsers,deleteUser } from '../controllers/authController.js';
import {authenticate} from '../middlewares/authenticate.js'
const router = Router();

router.post('/register',register)
router.post('/login',login)
router.get('/me',checkAuth)
router.get('/allUsers',authenticate,getAllUsers);
router.delete('/delete/:id',deleteUser);

export default router;