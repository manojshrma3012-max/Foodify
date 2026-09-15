import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import restaurant from "../models/restaurant.js";
import axios from "axios";
import FormData from "form-data";
import Menu,{menuItems} from '../models/itemmenu.js'

export const addmenuItems = TryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user){
        return res.status(400).json({
            message : "User Not found"
        })
    }
    const rest = await restaurant.findOne({ownerId:req.user.id})
    if(!rest){
        return res.status(400).json({
            message : "Please Add a restaurant First"
        })
    }
    const {name,description,price} = req.body
    if(!name || !price){
        return res.status(400).json({
            message : "Name And Price are required"
        })
    }

    const file = req.file
    if(!file){
        return res.status(400).json({
            message : "file not found"
        })
    }

    const filebuffer = file.buffer
    console.log(filebuffer)
    const form = new FormData();

    form.append("folder", "restaurants");

    form.append("file", file.buffer as any, {
        filename: file.originalname,
        contentType: file.mimetype
    });

    const {data} = await axios.post(
        "http://localhost:5002/api/uploads",
        form,
        {
            headers: form.getHeaders()
        }
    );
    console.log(data)
    const item = await Menu.create({
        name,
        image:data.url,
        price,
        description
    })

})
//  restID : mongoose.Types.ObjectId,
//     name : string,
//     description : string,
//     image : string,
//     price : number,
//     inStock : boolean,
//     createdAt:Date,
//     updatedAt:Date