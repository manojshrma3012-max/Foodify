import { ObjectId } from 'mongodb';
import TryCatch from '../middlewares/trycatch.js';
import { getrestacollection, getridercollection } from '../utils/collection.js';
export const getpendingrest = TryCatch(async (req, res) => {
    const restaurant = await (await getrestacollection()).find({
        isverified: false
    }).toArray();
    console.log("restaurants are :", restaurant);
    res.json({
        count: restaurant.length,
        restaurant
    });
});
export const getpendingriders = TryCatch(async (req, res) => {
    const riders = await (await getridercollection()).find({
        isverified: false
    }).toArray();
    console.log(riders);
    res.json({
        count: riders.length,
        riders
    });
});
export const verifyrest = TryCatch(async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({
            message: "Invlalid rest id"
        });
    }
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid object id"
        });
    }
    const result = await (await getrestacollection()).updateOne({
        _id: new ObjectId(id)
    }, {
        $set: {
            isverified: true,
            updatedAt: new Date()
        }
    });
    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "Restaurant not found"
        });
    }
    return res.status(200).json({
        message: "Restaurant verified successfully"
    });
});
export const verifyrider = TryCatch(async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
        return res.status(400).json({
            message: "Invlalid rider id"
        });
    }
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid object id"
        });
    }
    const result = await (await getridercollection()).updateOne({
        _id: new ObjectId(id)
    }, {
        $set: {
            isverified: true,
            updatedAt: new Date()
        }
    });
    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "Rider not found"
        });
    }
    return res.status(200).json({
        message: "Rider verified successfully"
    });
});
