import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import {io,Socket} from 'socket.io-client'
import { useAppdata } from './AppContext'
import { socketserviceurl } from '../main'

interface socketcontext{
    socket : Socket | null
}

const SocketContext = createContext<socketcontext>({socket:null})

export const SocketProvider = ({children}: { children: ReactNode }) => {

    const {isAuth} = useAppdata()
    const socketref = useRef<Socket|null>(null)
    const [socketInstance, setSocketInstance] = useState<Socket|null>(null)
    useEffect(()=>{
        if(!isAuth){
            socketref.current?.disconnect()
            socketref.current = null
            return
        }
        if(socketref.current) return 
        const socket = io(socketserviceurl,{
            auth:{
                token: localStorage.getItem("token")
            },
            transports:["websocket"]
        })
        socketref.current = socket
        socket.on("connect",()=>{
            setSocketInstance(socket)
            console.log("Socket Connected",socket.id)
        })
        socket.on("disconnect",()=>{
            setSocketInstance(current => current === socket ? null : current)
            console.log("Socket disConnected",socket.id)
        })
        socket.on("connect_error",(err)=>{
            console.error(`Socket connection failed: ${err.message}`)
        })
        return ()=>{
            socket.disconnect()
            socketref.current = null
        }
    },[isAuth])

    
  

    return (
        <SocketContext.Provider value={{socket: socketref.current}}>
            {children}
        </SocketContext.Provider>
    )
}
export const useSocket = ()=>{
    return useContext(SocketContext)
}