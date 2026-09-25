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
            console.log("Socket Connected",socket.id)
        })
        socket.on("disconnect",()=>{
            console.log("Socket disConnected",socket.id)
        })
        socket.on("connect_error",(err)=>{
            console.log(`socker error : ${err.message}`)
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
export const usesocket = ()=>{
    return useContext(SocketContext)
}