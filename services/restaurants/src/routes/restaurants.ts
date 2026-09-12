import express from 'express'
import {isSeller,authmiddle} from '../middlewares/isAuth.js'
import { addrestaurants, fetchmyrestaurant } from '../controllers/restaurants.js'
const addroute = express.Router()

addroute.post('/addnew',authmiddle,isSeller,addrestaurants)
addroute.get('/my',authmiddle,isSeller,fetchmyrestaurant)
export default addroute