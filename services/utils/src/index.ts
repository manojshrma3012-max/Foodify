import express from 'express'
import cors from 'cors'
import uploadroutes from './routes/cloudinary.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors)
dotenv.config()
 app.use(express.json({limit:"50 mb"}))
 app.use(express.urlencoded({limit:"50 mb",extended:true}))


app.use('/api',uploadroutes)



const PORT = process.env.PORT || 5002
app.listen(PORT,()=>{
    console.log(`utils running on ${PORT}`)
   
})