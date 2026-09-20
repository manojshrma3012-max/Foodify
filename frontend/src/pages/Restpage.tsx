import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { menuItems, Restaurant } from "../Types"
import axios from "axios"
import { restserviceurl } from "../main"
import RestaurantProfile from "../components/RestaurantProfile"
import Menuitems from "../components/Menuitems"


const Restpage = () => {
    const {id} = useParams()
    const [rest, setrest] = useState<Restaurant | null>(null)
    const [items, setitems] = useState<menuItems[]>([])
    const [loading, setloading] = useState(true)
const fetchrest = async ()=>{
        try {
            const {data}= await axios.get(`${restserviceurl}/api/restaurants/getsingle/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            setrest(data.rest || null)
        } catch (error) {
            console.log(error)     
        }finally{
            setloading(false)
        }
    }
const fetchitems = async()=>{
  try {
    const {data} = await axios.get(`${restserviceurl}/api/items/all/${id}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    console.log(data)
    setitems(data.items)
  } catch (error) {
    console.log(error)
  }
 }
 useEffect(()=>{
    if(id){
        fetchitems()
        fetchrest()
    }
 },[id])
 if(loading)  {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="text-sm font-medium text-gray-500">
            Loading restaurant...
          </p>
        </div>
      </div>
    );
 }
 if(!rest)  {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
          <p className="text-sm font-medium text-gray-500">
            No Restuarnt Found
          </p>
        </div>
      </div>
    );
 }
  return (
    <div className="min-h-screen bg-gray-50px-4 space-y-6">
      <RestaurantProfile restaurant={rest} onUpdate={fetchrest} userRole="user"/>
      <div className="rounded-xl bg-white shadow-sm p-4">
        <Menuitems items={items} isseller = {false} onItemdeleted={async () => {}}/>
      </div>


    </div>
  )
}

export default Restpage