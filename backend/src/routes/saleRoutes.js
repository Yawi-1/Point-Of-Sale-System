import {Router} from 'express'
import { getAllSales,addSales,getSalesByStaff,razorpayPayement,verifyPayment } from '../controllers/saleController.js';
import {authenticate} from '../middlewares/authenticate.js'
const router = Router();

router.post('/add',authenticate,addSales);
router.post('/pay',razorpayPayement);
router.post('/verify',verifyPayment);
router.get('/all',getAllSales);
router.get('/each',authenticate,getSalesByStaff)

export default router;