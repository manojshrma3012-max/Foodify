import express from 'express'
import {isSeller,authmiddle} from '../middlewares/isAuth.js'
import { addrestaurants } from '../controllers/restaurants.js'
const addroute = express.Router()

addroute.post('/addnew',authmiddle,isSeller,addrestaurants)
export default addroute