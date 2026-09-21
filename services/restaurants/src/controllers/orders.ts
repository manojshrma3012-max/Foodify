import { deleteModel } from "mongoose";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import Address from "../models/Address.js";
import cart from "../models/cart.js";
import { menuItems } from "../models/itemmenu.js";
import restaurant, { Irestaurant } from "../models/restaurant.js";
import { Order } from "../models/orders.js";


export const createorder = TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
            message :"Unauthorized"
        })
    }
    const {paymentmethod,addressid,distance} = req.body
    if(!addressid){
        return res.status(400).json({
            message : "address required"
        })
    }
    const address = await Address.findOne({
        _id : addressid,
        userId:user.id
    })
    if(!address){
        return res.status(404).json({
            message : "address not found"
        })
    }
    const cartitems = await cart.find({
        userid:user.id
    }).populate<{itemid : menuItems}>("itemid").populate<{restid : Irestaurant}>("restid")
    if(cartitems.length===0){
        return res.status(400).json({
            message : "Cart is Empty"
        })
    }
    console.log(cartitems)
    const firstcartitem = cartitems.at(0)
    if(!firstcartitem || !firstcartitem.restid){
        return res.status(400).json({
            message : "Invalid Cart data"
        })
    }
    const restid = firstcartitem.restid._id
    const rest = await restaurant.findById({restid})
    if(!rest){
        return res.status(404).json({
            message : "No Restaurant Found"
        })
    }
    if(!rest.isOpen){
        return res.status(404).json({
            message : "Restaurant Is closed"
        })
    }
    let subtotal = 0;
    const orderitem = cartitems.map((cart)=>{
        const item = cart.itemid
        if(!item){
            throw new Error("Invalid Cart")
        }
        const itemtotal = item.price * cart.quantity
        subtotal += itemtotal
        return {
            itemid : item._id.toString(),
            name:item.name,
            price:item.price,
            quantity : cart.quantity
        }
    })
    const deliveryfee = subtotal<250 ? 49 : 0
    const platformfee = 7
    const totalamount = subtotal+deliveryfee+platformfee
    const expireat = new Date(Date.now()+15*60*1000)
    const [longitude, latitude] = address.location.coordinates
    const rideramount = Math.ceil(distance)*17
    const order = await Order.create({
        userId:user.id.toString(),
        restid:rest._id.toString(),
        restname:rest.name,
        riderId:null,
        items:orderitem,
        deliveryfee,platformfee,totalamount,
        addressid:address._id.toString(),
        deliveryaddress:{
            formattedAddredd:address.formattedAddress,
            mobileno:address.mobile,
            latitude,
            longitude
        },
        paymentmethod:paymentmethod,
        distance,
        rideramount,
        paymentstatus:"pending",
        status:"placed",
        expireat:expireat

    })
    await cart.deleteMany({userid:user.id})
    return res.status(201).json({
        message : "Order Created Successfully",
        OrderId : order._id.toString(),
        amount : totalamount
    })

})
export const fetchorderforpayment = TryCatch(async(req,res)=>{
    if(req.headers["x-internal-key"]!==process.env.INTERNAL_KEY){
        return res.status(403).json({
            message : "forbiddden"
        })

    }
})