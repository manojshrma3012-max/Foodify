import express from 'express';
import { authmiddle } from '../middlewares/isAuth.js';
import { addtocart, fetchcart } from '../controllers/cart.js';
const cartrouter = express.Router();
cartrouter.post('/add', authmiddle, addtocart);
cartrouter.post('/all', authmiddle, fetchcart);
export default cartrouter;
