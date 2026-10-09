import axios from "axios";
import FormData from "form-data";
import TryCatch from "../middlewares/trycatch.js";
import { Rider } from "../models/rider.js";
export const addriderprofile = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorised"
        });
    }
    if (user.role !== "rider") {
        return res.status(403).json({
            message: "User must be rider"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "File not found"
        });
    }
    const form = new FormData();
    form.append("folder", "rider");
    form.append("file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
    });
    const { data } = await axios.post("http://localhost:5002/api/uploads", form, {
        headers: {
            ...form.getHeaders()
        }
    });
    const url = data.url;
    const { phoneNo, adhaarnumber, drivingLiscenceNumber, latitude, longitude } = req.body;
    if (!phoneNo || !adhaarnumber || !drivingLiscenceNumber || !longitude || !latitude) {
        return res.status(400).json({
            message: "details are not given"
        });
    }
    const existingprofile = await Rider.findOne({
        userId: user.id
    });
    if (existingprofile) {
        return res.status(400).json({
            message: "Profile Already Exists"
        });
    }
    const riderprofile = await Rider.create({
        userId: user.id,
        image: url,
        phoneNo: phoneNo,
        adhaarnumber: adhaarnumber,
        drivingLiscenseNumber: drivingLiscenceNumber,
        location: {
            type: "Point",
            coordinates: [longitude, latitude]
        },
        isAvailable: false
    });
    return res.status(201).json({
        message: "Rider Created Successfully",
        rider: riderprofile
    });
});
export const fetchmyprofile = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorised"
        });
    }
    if (user.role !== "rider") {
        return res.status(403).json({
            message: "User must be rider"
        });
    }
    const account = await Rider.findOne({ userId: user.id });
    if (!account) {
        return res.status(400).json({
            message: "please create a account first"
        });
    }
    return res.status(200).json({
        message: "rider fetched succesfully",
        rider: account
    });
});
export const toggleavailability = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorised"
        });
    }
    if (user.role !== "rider") {
        return res.status(403).json({
            message: "User must be rider"
        });
    }
    const { isAvailable, latitude, longitude } = req.body;
    if (typeof isAvailable !== "boolean") {
        return res.status(400).json({
            message: "wrong parameters type"
        });
    }
    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            message: "Location Required"
        });
    }
    const account = await Rider.findOne({ userId: user.id });
    if (!account) {
        return res.status(400).json({
            message: "please create a account first"
        });
    }
    if (isAvailable && !account.isverified) {
        return res.status(403).json({
            message: "Not Verified Account"
        });
    }
    account.isAvailable = isAvailable;
    account.location = {
        type: "Point",
        coordinates: [longitude, latitude]
    };
    account.lastactiveat = new Date();
    await account.save();
    return res.status(200).json({
        message: isAvailable ? "Rider is Now online" : "Rider is now offline",
        rider: account
    });
});
export const acceptorder = TryCatch(async (req, res) => {
    const rideruserid = req.user?.id;
    const { orderid } = req.params;
    if (!rideruserid) {
        return res.status(400).json({
            message: "please log in"
        });
    }
    const rider = await Rider.findOne({ userId: rideruserid, isAvailable: true });
    if (!rider) {
        return res.status(404).json({
            message: "rider not found"
        });
    }
    try {
        const { data } = await axios.put(`${process.env.REST_SERVICE_URL}/api/order/assign-rider`, {
            phoneNo: rider.phoneNo, orderid, ridername: req.user?.name, riderid: rider._id.toString()
        }, {
            headers: {
                "x-internal-key": process.env.INTERNAL_KEY
            }
        });
        if (data.success) {
            const riderdeatils = await Rider.findOneAndUpdate({
                userId: rideruserid,
                isAvailable: true
            }, { isAvailable: false }, { new: true });
        }
        res.json({
            message: "Order Accepted"
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Order already taken"
        });
    }
});
export const fetchmyorder = TryCatch(async (req, res) => {
    const rideruserid = req.user?.id;
    if (!rideruserid) {
        return res.status(400).json({
            message: "please log in"
        });
    }
    console.log(rideruserid);
    const rider = await Rider.findOne({ userId: rideruserid, isverified: true });
    if (!rider) {
        return res.status(404).json({
            message: "rider not found"
        });
    }
    try {
        const { data } = await axios.get(`${process.env.REST_SERVICE_URL}/api/order/rider-order/?riderid=${rider._id}`, {
            headers: {
                "x-internal-key": process.env.INTERNAL_KEY
            }
        });
        console.log(data);
        res.json({
            order: data
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "internal server error"
        });
    }
});
export const updateorderstatus = TryCatch(async (req, res) => {
    const userid = req.user?.id;
    if (!userid) {
        return res.status(401).json({
            message: "Please login first"
        });
    }
    const rider = await Rider.findOne({ userId: userid });
    if (!rider) {
        return res.status(404).json({
            message: "Rider profile not found"
        });
    }
    const { orderid } = req.params;
    if (!orderid) {
        return res.status(400).json({
            message: "Order id and status are required"
        });
    }
    try {
        const { data } = await axios.put(`${process.env.REST_SERVICE_URL}/api/order/updateorder/rider`, {
            orderid
        }, {
            headers: {
                "x-internal-key": process.env.INTERNAL_KEY
            }
        });
        return res.status(200).json({
            message: "Order status updated successfully",
            data
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Failed to update order status"
        });
    }
});
