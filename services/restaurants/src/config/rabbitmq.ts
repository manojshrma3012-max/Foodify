import amqp from 'amqplib'
let channel:amqp.Channel

export const connectrabbitmq = async ()=>{
    const conn =  await amqp.connect(process.env.RABBITMQ_URL!)
    channel = await conn.createChannel()
    await channel.assertQueue(process.env.PAYMENT_QUEUE,{
        durable:true
    })
    console.log("connected to rabbit mq")
}

export const getchannel = ()=>channel