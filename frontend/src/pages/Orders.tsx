import { useEffect, useState } from "react"
import type { ordertype } from "../Types"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../context/SocketContext"
import axios from "axios"
import { restserviceurl } from "../main"

const ACTIVE_STATUSES = [
    "placed",
    "accepted",
    "preparing",
    "ready_for_rider",
    "rider-assigned",
    "picked-up"
]

const Orders = () => {
    const [orders, setorders] = useState<ordertype[]>([])
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()
    const {socket} = useSocket()
    const fetchorders = async()=>{
        try {
            setloading(true)
            const {data} = await axios.get(`${restserviceurl}/api/orders/get-all`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            setorders(data.orders || [])
            
        } catch (error) {
            console.log(error)
        }finally{
            setloading(false)
        }
    }
    useEffect(()=>{
        fetchorders()
    },[])
    useEffect(()=>{
        if(!socket) return 
        const onupdated=()=>{
            fetchorders()
        }
        socket.on("order:update",onupdated)
        return ()=>{
            socket.off("order:update",onupdated)
        }
    },[socket])
    if(loading){
        return <p className="text-center text-gray-500 font-sm">Laoding your Orders</p>
    }
    if(orders.length===0){
        return <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-gray-500">No Orders Yet</p>
        </div>
    }
    
  return (
    <div>

    </div>
  )
}

export default Orders