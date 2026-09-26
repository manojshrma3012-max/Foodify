import {Router} from 'express'
import { authmiddle, isSeller } from '../middlewares/isAuth.js'
import { createorder, fetchorderforpayment, fetchRestaurantOrders, fetchsingleorder, getmyorders, updateorderstatus } from '../controllers/orders.js'

const orderroute = Router()

orderroute.post('/create-order',authmiddle,createorder)
orderroute.get('/get-order/:id',fetchorderforpayment)
orderroute.get('/:restid',authmiddle,isSeller,fetchRestaurantOrders)
orderroute.put('/update/:orderid',authmiddle,isSeller,updateorderstatus)
orderroute.get('/user',authmiddle,getmyorders)
orderroute.get('/single/:orderid',authmiddle,fetchsingleorder)
export default orderroute