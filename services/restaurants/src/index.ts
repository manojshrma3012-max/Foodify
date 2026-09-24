import express from 'express'
import connectDb from './config/db.js'
import dotenv from 'dotenv'
import addroute from './routes/restaurants.js'
import menuroutes from './routes/menuitems.js'
import cors from 'cors'
import cartrouter from './routes/cart.js'
import addressrouter from './routes/address.js'
import orderroute from './routes/order.js'
import { connectrabbitmq } from './config/rabbitmq.js'
import { paymentconsumer } from './config/payment.consumer.js'
dotenv.config()
const app = express()
app.use(cors())
await connectrabbitmq()
paymentconsumer()

app.use(express.json())
app.use('/api/restaurants',addroute)
app.use('/api/items',menuroutes)
app.use('/api/cart',cartrouter)
app.use('/api/address',addressrouter)
app.use('/api/order',orderroute)
const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log(`auth service running on ${PORT}`)
connectDb()
})