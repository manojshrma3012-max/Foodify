import { Router } from "express";
import { addrole, loginuser,getme } from "../controllers/auth.controller.js";
import { authmiddle } from "../middlewares/auth.middleware.js";


const authroutes = Router()
authroutes.post('/login',loginuser)
authroutes.put('/add/roles',authmiddle,addrole)
authroutes.get('/me', authmiddle,getme)
export default authroutes