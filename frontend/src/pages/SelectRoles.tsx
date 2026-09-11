import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppdata } from "../context/AppContext"
import axios from "axios"
import { serviceurl } from "../main"


const SelectRoles = () => {
    type Role = "customer" | "rider" | "seller"| null 
    const [Roles, setRoles] = useState<Role>(null)
    const {setUser} = useAppdata()
    const navigate = useNavigate()
    const Role:Role[] = ["customer","rider","seller"]
    const addrole = async ()=>{
        try{
           const {data} = await axios.put(`${serviceurl}/api/auth/add/roles`,{Roles},{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
           })
           console.log(data)
           localStorage.setItem("token",data.token)
           setUser(data.user)
           navigate('/',{replace:true})
        }catch(err){
            console.log(err)

        }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="w-full max-w-sm space-y-6">
            <h1 className="text-center font-bold text-2xl"> Choose Your Role</h1>
            <div className="space-y-4">
                {Role.map((r)=>(
                    <button key={r} onClick={()=>setRoles(r)} className={`
                    w-full rounded-xl border px-4 py-3 text-sm font-medium capitalize
                    transition ${
                    Roles===r ? "border-[#E23744] bg-[#E23744] text-white" : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"}`}>
                        Continue as {r}
                    </button>
                ))}
            </div>
            <button disabled={!Roles} onClick={addrole} className={`w-full rounded-xl text-white text-sm px-4 py-3 font-semibold
                transition ${
                    Roles ? "border-[#E23744] bg-[#E23744] text-white hover:bg-[#d32f3a]" : " border-gray-300 bg-gray-700 text-gray-700 cursor-not-allowed"}`}>Next</button>

        </div>

    </div>
  )
}

export default SelectRoles