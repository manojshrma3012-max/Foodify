import { Router } from "express";
import { authmiddle } from "../middlewares/isAuth.js";
const riderroutes = Router();
riderroutes.post('/addrider', authmiddle);
export default riderroutes;
