import {Router} from 'express'
import { createrazorpayorder, razorpayverify } from '../controllers/payment.js'
import { verifysign } from '../config/verifyrazorpay.js'
const paymentroutes = Router()
paymentroutes.post('/create',createrazorpayorder)
paymentroutes.post('/verify',razorpayverify)


export default paymentroutes