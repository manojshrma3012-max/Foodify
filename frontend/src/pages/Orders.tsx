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
    const activeorders = orders.filter((o)=>ACTIVE_STATUSES.includes(o.status));
    const completedorders = orders.filter((o)=>!ACTIVE_STATUSES.includes(o.status))
    
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">My Orders </h1>
        <section className="space-y-3">
            <h2 className="text-lg font-semibold ">Active Orders</h2>
            {activeorders.length===0 ? <p>No Active Orders</p> :
            activeorders.map((order)=>(
                <OrderRow key = {order._id} order = {order} 
                onClick = {()=>navigate(`/order/${order._id}`)}/>
            ))}

        </section>
        <section className="space-y-3">
            <h2 className="text-lg font-semibold ">Completed Orders</h2>
            {completedorders.length===0 ? <p>No Completed Orders</p> :
            activeorders.map((order)=>(
                <OrderRow key = {order._id} order = {order} 
                onClick = {()=>navigate(`/order/${order._id}`)}/>
            ))}

        </section>

       

    </div>
  )
}

export default Orders
const OrderRow = ({order,onClick}:{order:ordertype,onClick +:()=>void})=>{
    return <div className=" cursor-pointer bg-white p-4 shadow-sm hover:bg-gray-50" onClick={onClick}>
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Order #{order._id.slice}</p>

        </div>

    </div>
};