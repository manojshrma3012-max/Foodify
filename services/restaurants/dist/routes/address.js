import express from 'express';
import { authmiddle } from '../middlewares/isAuth.js';
import { addaddress, deleteaddress, fetchaddress } from '../controllers/Address.js';
const addressrouter = express.Router();
addressrouter.post('/add', authmiddle, addaddress);
addressrouter.delete('/delete/:id', authmiddle, deleteaddress);
addressrouter.get('/all', authmiddle, fetchaddress);
export default addressrouter;
