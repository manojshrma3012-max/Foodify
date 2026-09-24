import { getchannel } from "./rabbitmq.js"

export const paymentpublishsuccess = async(payload:{orderid:string,paymentid:string,provider:"razorpay"|"stripe"})=>{
    const channel = getchannel()
    channel.sendToQueue(
        process.env.PAYMENT_QUEUE!,
        Buffer.from(JSON.stringify({
            type:"PAYMENT_SUCCESS",
            data:payload
        })),{
            persistent:true
        }
    )
}