import axios from "axios";
import cart from "../models/cart.js";
import { Order } from "../models/orders.js";
import { getchannel } from "./rabbitmq.js";
export const paymentconsumer = async()=>{
    const channel = getchannel()
    channel.consume(process.env.PAYMENT_QUEUE!,async(msg)=>{
        if(!msg){
            return
        }
        try {
            const event = JSON.parse(msg.content.toString())
            if(event.type !== "PAYMENT_SUCCESS"){
                channel.ack(msg)
                return
            }
            const {orderid} = event.data
            const order = await Order.findOneAndUpdate(
                {
                    _id: orderid,
                    paymentstatus: { $ne: "paid" },
                },
                {
                    $set: {
                        paymentstatus: "paid",
                        status: "placed",
                    },
                    $unset:{
                        expireat:1
                    }
                },{new:true}
            )
            if(!order){
                channel.ack(msg)
                return
            }
             await axios.post(`${process.env.REALTIME_SERVICE}/api/v1/internal/emit`,{
                    event :"order:New",
                    room : `restaurant:${order.restid}`,
                    payload:{
                        orderid:order._id,
                    }
                },{
                    headers:{
                        "x-internal-key":process.env.INTERNAL_KEY
                    }
                })
            await cart.deleteMany({userid: order.userId})
            console.log(order)
            console.log("rest queue order placed",orderid)
            channel.ack(msg)     
        } catch (error) {
            console.error("Failed to process payment event:", error)
            channel.nack(msg, false, false);
        }
    })
}