import express from 'express'
import connectDb from './config/db.js'
import dotenv from 'dotenv'
import addroute from './routes/restaurants.js'
import cors from 'cors'
dotenv.config()
const app = express()
app.use(cors())

app.use(express.json())
app.use('/api/restaurants',addroute)
const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log(`auth service running on ${PORT}`)
connectDb()
})