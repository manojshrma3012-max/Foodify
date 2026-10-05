import { useEffect, useState } from "react"
import { riderserviceurl } from "../main"
import axios from "axios"
import toast from "react-hot-toast"

interface Props{
    orderid:String,
    onorderaccepted:()=>void
}
const RiderOrderRequest = ({orderid,onorderaccepted}:Props) => {
    const [accepting, setaccepting] = useState(false)
    const [secondsleft, setsecondsleft] = useState(10)
    useEffect(()=>{
        const interval = setInterval(() => {
            setsecondsleft((prev)=>{
                if(prev<=1){
                    clearInterval(interval)
                    onorderaccepted()
                    return 0
                }
                return prev-1
            })  
        }, 1000);
        return ()=>{
            clearInterval(interval)
        }
    },[onorderaccepted])
    const acceptorder = async()=>{
        try {
           const {data} = await axios.post(`${riderserviceurl}/api/rider/accept-order/${orderid}`,{},{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
           })
           console.log(data)
           toast.success("Order Accepted")
           onorderaccepted()
        } catch (error) {
            console.log(error)
        }finally{
            setaccepting(false)
        }
    }
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-green-300 space-y-3">
        <p className="text-center text-xs font-semibold text-red-600">
            Accept Within {secondsleft} Seoncds
        </p>
        <p className="text-center text-xs font-semibold text-green-600">
            New Delivery request
        </p>
        <p className="text-xs text-gray-600 ">
            Order ID: <b>{orderid.slice(-6)}</b>
        </p>
        <button disabled={accepting} onClick={acceptorder} className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 ">
            {accepting ? "Accepting...": "Accept Order"}
        </button>
    </div>
  )
}

export default RiderOrderRequest