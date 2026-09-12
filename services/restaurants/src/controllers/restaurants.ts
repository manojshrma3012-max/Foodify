
import axios from "axios";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import restaurant from "../models/restaurant.js";
import dotenv from 'dotenv'

dotenv.config()


export const addrestaurants = TryCatch(async (req:AuthenticatedRequest,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
            message : "unaothorized"
        })
    }
    const existing = await restaurant.findOne({
        ownerId:user.id
    })
    if(existing){
        return res.status(400).json({
            message : "can't add more than one restaurants"
        })
    }
    const {name,description,latitude,longitude,formattedaddress,phone} = req.body
    if(!name || !latitude || !longitude){
        return res.status(400).json({
            message : "All fields required"
        })
    }
    const file = req.file
    if(!file){
        return res.status(400).json({
            message : "file not found"
        })
    }
    const filebuffer = req.file?.buffer
    const {data} = await axios.post(`${process.env.UTILS_SERVICE_URL}/api/body`,{
        filebuffer,
        folder:"restaurants"
    })
    const rest = await restaurant.create({
        name,
        description,
        image:data.url,
        PhoneNo:phone,
        ownerId:user.id,
        autolocation:{
            type:"Point",
            coordinates:[Number(longitude),Number(latitude)],
            formattedAddress:formattedaddress
        }
    })
    return res.status(201).json({
        message : "Created Succefully",
        rest

    })

})