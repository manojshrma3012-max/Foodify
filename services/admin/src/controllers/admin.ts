import {ObjectId} from 'mongodb'
import TryCatch from '../middlewares/trycatch.js'
import {getrestacollection,getridercollection} from '../utils/collection.js'
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js'

export const getpendingrest = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const restaurant = await (await getrestacollection()).find({
        isVerified:false
    }).toArray()
    console.log(restaurant)
    res.json({
        count : restaurant.length,
        restaurant
    })
})
export const getpendingriders = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const riders = await (await getrestacollection()).find({
        isVerified:false
    }).toArray()
    console.log(riders)
    res.json({
        count : riders.length,
        riders
    })
})