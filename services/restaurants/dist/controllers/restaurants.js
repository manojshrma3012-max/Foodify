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
            restID: rest._id.toString()
        };
        const token = Jwt.sign(payloadUser, process.env.SECRET, { expiresIn: "15d" });
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
export const updaterestaurant = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(403).json({
            message: "User not found"
        });
    }
    const { status } = req.body;
    if (typeof status !== "boolean") {
        return res.status(400).json({
            message: "data should be true or false"
        });
    }
    const rest = await restaurant.findOneAndUpdate({
        ownerId: req.user.id
    }, { isOpen: status }, { new: true });
    if (!rest) {
        return res.status(400).json({
            message: "Restaurant Not Founcd"
        });
    }
    return res.status(200).json({
        messaage: "updated successfully",
        restaurant: rest
    });
});
export const updaterestaurantdetails = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(403).json({
            message: "User not found"
        });
    }
    const { name, description } = req.body;
    // Validate name
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            message: "Restaurant name is required"
        });
    }
    // Validate description
    if (typeof description !== "string") {
        return res.status(400).json({
            message: "Description should be a string"
        });
    }
    const rest = await restaurant.findOneAndUpdate({
        ownerId: req.user.id
    }, {
        name: name.trim(),
        description: description.trim()
    }, {
        new: true
    });
    if (!rest) {
        return res.status(404).json({
            message: "Restaurant not found"
        });
    }
    return res.status(200).json({
        message: "Restaurant updated successfully",
        restaurant: rest
    });
});
export const getnearbyrest = TryCatch(async (req, res) => {
    const { latitude, longitude, radius = 5000, search = "" } = req.query;
    if (!longitude || !latitude) {
        return res.status(400).json({
            messaage: "Details Required"
        });
    }
    const query = {
        isverified: true
    };
    if (search && typeof search === "string") {
        query.name = { $regex: search, $options: "i" };
    }
    const rest = await restaurant.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [Number(longitude), Number(latitude)]
                },
                distanceField: "distance",
                maxDistance: Number(radius),
                spherical: true,
                query,
            }
        },
        {
            $sort: {
                isOpen: -1,
                distance: 1,
            }
        }, {
            $addFields: {
                distanceKm: {
                    $round: [{ $divide: ["$distance", 1000] }, 2]
                }
            }
        }
    ]);
    res.status(200).json({
        rest,
        count: rest.length
    });
});
export const fetchsingle = TryCatch(async (req, res) => {
    const rest = await restaurant.findById(req.params.id);
    res.status(200).json({
        message: "fetched",
        rest
    });
});
