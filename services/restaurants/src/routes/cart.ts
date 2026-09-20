import express from 'express'
import { authmiddle } from '../middlewares/isAuth.js'
import { addtocart, clearcart, decreament, fetchcart, increament } from '../controllers/cart.js'
const cartrouter = express.Router()
cartrouter.post('/add',authmiddle,addtocart)
cartrouter.get('/all',authmiddle,fetchcart)
cartrouter.put('/inc',authmiddle,increament)
cartrouter.put('/dec',authmiddle,decreament)
cartrouter.delete('/clearcart',authmiddle,clearcart)
export default cartrouter