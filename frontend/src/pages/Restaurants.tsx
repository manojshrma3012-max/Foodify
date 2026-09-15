import { useEffect, useState } from "react"
import {type Restaurant } from "../Types"
import axios from "axios"
import { restserviceurl } from "../main"
import AddRestaurants from "../components/AddRestaurants"
import RestaurantProfile from "../components/RestaurantProfile"
import { useAppdata } from "../context/AppContext"
import Menuitems from "../components/Menuitems"
import AddMenuitems from "../components/AddMenuitems"
type sellerTab = "menu" | "sales" | "add-items"


const Restaurants = () => {
 const [Restaurant, setRestaurant] = useState<Restaurant|null>(null)
 const [loading, setloading] = useState(true)
 const {user} = useAppdata()
 const [tab,settab] = useState<sellerTab>("menu")
 const fetchrest = async ()=>{
  try {
    const {data} = await axios.get(`${restserviceurl}/api/restaurants/my`,
      {
        headers:{
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    console.log(data)
    setRestaurant(data.restaurant || null)
    if(data.token){
      localStorage.setItem("token",data.token)
      window.location.reload()
    }
    
  } catch (error) {
    console.log(error)
    
  }finally{
    setloading(false)
  }
 }
 useEffect(()=>{
  fetchrest()
 },[])
 if(loading) {return <div>Loading...</div>}
 if(!Restaurant){
  return <AddRestaurants fetchrest={fetchrest}/>
 }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">
      <RestaurantProfile restaurant={Restaurant} userRole={user?.role} onUpdate={setRestaurant} />

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex border-b">
          {[
            { key: "menu", label: "Menu Items" },
            { key: "sales", label: "Sales" },
            { key: "add-items", label: "Add Items" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => settab(key as sellerTab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                tab === key ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "menu" && <div><Menuitems/></div>}
          {tab === "sales" && <div>Sales</div>}
          {tab === "add-items" && <div><AddMenuitems/></div>}
        </div>
      </div>
    </div>
  )
}

export default Restaurants