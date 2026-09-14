import axios from "axios";
import FormData from "form-data";
import TryCatch from "../middlewares/trycatch.js";
import restaurant from "../models/restaurant.js";
import dotenv from 'dotenv';
import Jwt from "jsonwebtoken";
dotenv.config();
export const addrestaurants = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "unaothorized"
        });
    }
    const existing = await restaurant.findOne({
        ownerId: user.id
    });
    if (existing) {
        return res.status(400).json({
            message: "can't add more than one restaurants"
        });
    }
    const { name, description, latitude, longitude, formattedaddress, phone } = req.body;
    if (!name || !latitude || !longitude) {
        return res.status(400).json({
            message: "All fields required"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "file not found"
        });
    }
    const filebuffer = req.file?.buffer;
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
    const rest = await restaurant.create({
        name,
        description,
        image: data.url,
        PhoneNo: phone,
        ownerId: user.id,
        autolocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress: formattedaddress
        }
    });
    return res.status(201).json({
        message: "Created Succefully",
        rest
    });
});
export const fetchmyrestaurant = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "seller not found"
        });
    }
    const rest = await restaurant.findOne({
        ownerId: req.user.id
    });
    if (!rest) {
        return res.status(400).json({
            message: "rest not found"
        });
    }
    if (!req.user.restID) {
        const payloadUser = {
            ...req.user,
            restID: req.user.restID || rest._id.toString()
        };
        const token = Jwt.sign({ user: payloadUser }, process.env.SECRET || "default_secret", { expiresIn: "15d" });
        return res.status(200).json({
            message: "Restaurant fetched successfully",
            restaurant: rest,
            token
        });
    }
    res.status(200).json({
        restaurant: rest
    });
});
