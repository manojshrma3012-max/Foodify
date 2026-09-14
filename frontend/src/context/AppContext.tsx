import { createContext, useContext, useEffect, useState } from "react";
import { serviceurl } from "../main"
import axios from "axios"
import { type AppContext } from '../Types'
import { Toaster } from "react-hot-toast";

const appcontext = createContext<AppContext | undefined>(undefined);

export const Appprovider = ({children}:{children:React.ReactNode}) => {
    const [User, setUser] = useState<AppContext["user"]>(null)
    const [isAuth, setisAuth] = useState(false)
    const [Location, setLocation] = useState<AppContext["location"]>(null)
    const [loadingLoc, setloadingLoc] = useState(false)
    const [City, setCity] = useState("Unknown")
    const [loading, setloading] = useState(true)

    async function fetchuser() {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                console.log("No token found, user is not authenticated.");
                return
            }
            const { data } = await axios.get(`${serviceurl}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(data.user)
            setisAuth(true)
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchuser()
    }, [])

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Allow location to continue");
            return;
        }

        setloadingLoc(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                    const data = await res.json()

                    setLocation({
                        latitude,
                        longitude,
                        FormattedAddress: data.display_name || "current location"
                    })
                    setCity(
                        data.address.city || data.address.town || data.address.village || "your location"
                    )
                } catch (error) {
                    setLocation({
                        latitude,
                        longitude,
                        FormattedAddress: "Current Location"
                    })
                    setCity("Failed to fetch city")
                } finally {
                    setloadingLoc(false)
                }
            },
            (error: GeolocationPositionError) => {
                console.error("Error getting location:", error);
                setloadingLoc(false);
            }
        );
    }, [])

    return (
        <appcontext.Provider value={{ user: User, isAuth, location: Location, loadingLoc, city: City, loading, setUser, setisAuth, setLocation, setloadingLoc, setCity, setloading }}>
            {children}
            <Toaster/>
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