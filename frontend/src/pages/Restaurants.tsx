import { useEffect, useState } from "react"
import {type Restaurant } from "../Types"
import axios from "axios"
import { restserviceurl } from "../main"
import AddRestaurants from "../components/AddRestaurants"


const Restaurants = () => {
 const [Restaurant, setRestaurant] = useState<Restaurant|null>(null)
 const [loading, setloading] = useState(true)
 const fetchrest = async ()=>{
  try {
    const {data} = await axios.get(`${restserviceurl}/api/restaurants/my`,
      {
        headers:{
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    setRestaurant(data.restaurant || null)
    if(data.token){
      localStorage.setItem("token",data.token)
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
  return <AddRestaurants/>
 }
  return (
    <div>Restaurants</div>
  )
}

export default Restaurants