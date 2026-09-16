import { useEffect, useState } from "react"
import {type menuItems, type Restaurant } from "../Types"
import axios from "axios"
import { restserviceurl } from "../main"
import AddRestaurants from "../components/AddRestaurants"
import RestaurantProfile from "../components/RestaurantProfile"
import { useAppdata } from "../context/AppContext"
import Menuitems from "../components/Menuitems"
import AddMenuitems from "../components/AddMenuitems"
import toast from "react-hot-toast"
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
 const [menuItems, setmenuItems] = useState<menuItems[]>([])
 const fetchitems = async(restId : string)=>{
  try {
    const {data} = await axios.get(`${restserviceurl}/api/items/all/${restId}`,{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    console.log(data)
    setmenuItems(data.items)
  } catch (error) {
    console.log(error)
  }
 }
 useEffect(()=>{
  console.log("useffect called")
  console.log(Restaurant?._id)
  if(Restaurant?._id){
    fetchitems(Restaurant._id)
  }
 },[Restaurant])
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
          {tab === "menu" && (
            <Menuitems
              items={menuItems}
              onItemdeleted={() => fetchitems(Restaurant._id)}
              isseller={user?.role === "seller"}
            />
          )}
          {tab === "sales" && <div>Sales</div>}
          {tab === "add-items" && <div><AddMenuitems onItemAdded={()=>fetchitems(Restaurant._id)}/></div>}
        </div>
      </div>
    </div>
  )
}

export default Restaurants