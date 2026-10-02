import { Router } from "express";
import { authmiddle, isRider } from "../middlewares/isAuth.js";
import { addriderprofile, fetchmyprofile } from "../controllers/rider.js";
const riderroutes = Router()
riderroutes.post('/addrider',authmiddle,isRider,addriderprofile)
riderroutes.post('/get-rider',authmiddle,isRider,fetchmyprofile)
export default riderroutes