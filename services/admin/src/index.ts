import express from 'express'
import dotenv from 'dotenv'
import adminroutes from './routes/admin.js'
dotenv.config()
const app = express()
app.use(express.json())
app.use('/admin',adminroutes)
app.listen(process.env.PORT,()=>{
    console.log("Admin server running")
})