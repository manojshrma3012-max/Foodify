import { Router } from 'express';
import { authmiddle } from '../middlewares/isAuth.js';
import { createorder, fetchorderforpayment } from '../controllers/orders.js';
const orderroute = Router();
orderroute.post('/create-order', authmiddle, createorder);
orderroute.get('/get-order/:id', fetchorderforpayment);
export default orderroute;
