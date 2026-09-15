import express from 'express'
import {isSeller,authmiddle} from '../middlewares/isAuth.js'
import { addrestaurants, fetchmyrestaurant, updaterestaurant, updaterestaurantdetails } from '../controllers/restaurants.js'
import uploadfile from '../middlewares/multer.js'
const menuroutes = express.Router()
menuroutes.post('/new',)


export default menuroutes