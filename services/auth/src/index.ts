import express from 'express'
import authroutes from './routes/auth.routes.js'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json())


import dotenv from 'dotenv'
import connectDb from './config/db.js'
dotenv.config()
const PORT = process.env.PORT || 5000
app.use('/api/auth',authroutes)
app.listen(PORT,()=>{
    console.log(`auth service running on ${PORT}`)
    connectDb()
})