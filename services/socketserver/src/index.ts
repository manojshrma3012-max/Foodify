import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
const app = express()
app.use(cors())
dotenv.config()

app.listen(process.env.PORT,()=>{
    console.log(`Realtime server running on ${process.env}`)
})