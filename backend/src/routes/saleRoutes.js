import {Router} from 'express'
import { getAllSales,addSales,getSalesByStaff,stripePayment } from '../controllers/saleController.js';
import {authenticate} from '../middlewares/authenticate.js'
const router = Router();

router.post('/add',authenticate,addSales);
router.post('/pay',stripePayment);
router.get('/all',getAllSales);
router.get('/each',authenticate,getSalesByStaff)

export default router;