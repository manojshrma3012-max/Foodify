import { Router } from "express";
import { authmiddle, isRider } from "../middlewares/isAuth.js";
import { addriderprofile, fetchmyprofile, toggleavailability } from "../controllers/rider.js";
import uploadfile from "../middlewares/multer.js";
const riderroutes = Router()
riderroutes.post('/addrider',authmiddle,isRider,uploadfile,addriderprofile)
riderroutes.get('/get-rider',authmiddle,isRider,fetchmyprofile)
riderroutes.patch('/togglestatus',authmiddle,isRider,toggleavailability)
export default riderroutes