import express from 'express'
import {getio} from '../socket.js'
const router = express.Router()
router.post('/emit',(req,res)=>{
     if(req.headers["x-internal-key"]!==process.env.INTERNAL_KEY){
        return res.status(403).json({
            message : "forbiddden"
        })
        const {event,room,payload} = req.body
        if(!event || !room){
            return res.status(403).json({
                messqage : "event and room required"
            })
        }
        const io = getio()
        console.log(`Emitting Event ${event} to room ${room}`)
        io.to(room).emit(event,payload ?? {})
        return res.json({success:true})
        


    }
})
export default router
