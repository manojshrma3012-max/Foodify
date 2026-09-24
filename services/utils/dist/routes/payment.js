import { Router } from 'express';
import { createrazorpayorder, razorpayverify } from '../controllers/payment.js';
const paymentroutes = Router();
paymentroutes.post('/create', createrazorpayorder);
paymentroutes.post('/verify', razorpayverify);
export default paymentroutes;
