import { createContext, useContext, useEffect, useState } from "react";
import { serviceurl } from "../main"
import axios from "axios"
import { type AppContext } from '../Types'

const appcontext = createContext<AppContext | undefined>(undefined);

export const Appprovider = ({children}:{children:React.ReactNode}) => {
    const [User, setUser] = useState<AppContext["user"]>(null)
    const [isAuth, setisAuth] = useState(false)
    const [Location, setLocation] = useState<AppContext["location"]>(null)
    const [loadingLoc, setloadingLoc] = useState(false)
    const [City, setCity] = useState("Unknown")
    const [loading, setloading] = useState(true)
    async function fetchuser(){
        try{
            const token = localStorage.getItem("token")
            if(!token){
                console.log("No token found, user is not authenticated.");
                return
            }
            const {data} = await axios.get(`${serviceurl}/api/auth/me`,{
                headers:{
                    Authorization : `Bearer ${token}`
                }
            })
            setUser(data.user)
            setisAuth(true)   
           

        }catch(error){
            console.error("Error fetching user:", error);
        }finally{
             setloading(false)
        }
    }
    useEffect(()=>{
        fetchuser()
    },[])
    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Allow location to continue");
            return;
        }

        setloadingLoc(true);

        navigator.geolocation.getCurrentPosition(
            async(position) => {
                const { latitude, longitude } = position.coords;
            }
        );
        try {
            
        } catch (error) {
            
        }
    }, []);
    return (
        <appcontext.Provider value={{ user: User, isAuth, location: Location, loadingLoc, city: City, loading, setUser, setisAuth, setLocation, setloadingLoc, setCity, setloading }}>
            {children}
        </appcontext.Provider>
    )
}

export const useAppdata = ():AppContext => {
    const context = useContext(appcontext);
    if (!context) {
        throw new Error("useAppdata must be used within an Appprovider");
    }
    return context;
}