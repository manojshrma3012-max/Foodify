import TryCatch from "../middlewares/trycatch.js";
import restaurant from "../models/restaurant.js";
import axios from "axios";
import FormData from "form-data";
import Menu from '../models/itemmenu.js';
export const addmenuItems = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(400).json({
            message: "User Not found"
        });
    }
    const rest = await restaurant.findOne({ ownerId: req.user.id });
    if (!rest) {
        return res.status(400).json({
            message: "Please Add a restaurant First"
        });
    }
    const { name, description, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({
            message: "Name And Price are required"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "file not found"
        });
    }
    const filebuffer = file.buffer;
    console.log(filebuffer);
    const form = new FormData();
    form.append("folder", "restaurants");
    form.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
    });
    const { data } = await axios.post("http://localhost:5002/api/uploads", form, {
        headers: form.getHeaders()
    });
    console.log(data);
    const item = await Menu.create({
        name,
        image: data.url,
        price,
        description,
        restID: rest._id
    });
    return res.status(201).json({
        message: "tiem added successfully",
        item
    });
});
export const fetchmenuitems = TryCatch(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(401).json({
            message: "Id is required"
        });
    }
    const items = await Menu.find({ restID: id });
    return res.status(200).json({
        items
    });
});
