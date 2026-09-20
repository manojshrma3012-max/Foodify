import { AuthTokenApiOptions } from "cloudinary";
import TryCatch from "../middlewares/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import Address from "../models/Address.js";


export const addaddress = TryCatch(async (req:AuthenticatedRequest,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
            message : "plaease Login First"
        })
    }
    const {mobile,formattedAddress,latitude,longitude} = req.body
    if(!mobile || !formattedAddress || !latitude || !longitude){
        return res.status(400).json({
            message : "Details not provided"
        })
    }
    const newaddress = await Address.create({
        userId:user.id,
        formattedAddress,
        mobile,
        location: {
            type:"Point",
            coordinates:[Number(longitude),Number(latitude)]
        }
    })
    res.status(201).json({
        message : "Address Addedd ",
        newaddress
    })
})
export const deleteaddress = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
            message : "plaease Login First"
        })
    }
    const {id} = req.params
    if(!id){
        return res.status(400).json({
            message : "id is required"
        })
    }
    const address = await Address.findOne({
        _id: id,
        userId:user.id
    })
    if(!address){
        return res.status(404).json({
            message : "Not Found"
        })
    }
    await address.deleteOne()
    return res.status(200).json({
        message : "deleted Successfully"
    })
})
export const fetchaddress = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
            message : "plaease Login First"
        })
    }
    const address = await Address.find({
        userId:user.id
    }).sort({createdAt:-1})
    return res.status(200).json({
        message : "address Fetched Successfully",
        address
    })


})