import {connectDB} from '../config/db.js'
export const getrestacollection = async()=>{
    const db = await connectDB()
    return db.collection("restaurants")
}
export const getridercollection = async()=>{
    const db = await connectDB()
    return db.collection("riders")
}