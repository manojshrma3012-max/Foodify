import mongoose from "mongoose";
import TryCatch from "../middlewares/trycatch.js";
import cart from "../models/cart.js";
export const addtocart = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Login First"
        });
    }
    const userid = req.user.id;
    const { restid, itemid } = req.body;
    if (!mongoose.Types.ObjectId.isValid(restid) || !mongoose.Types.ObjectId.isValid(itemid)) {
        return res.status(401).json({
            message: "Invalid restaurant"
        });
        const cartfromdiff = await cart.findOne({
            userid,
            restid: { $ne: restid }
        });
        if (cartfromdiff) {
            return res.status(401).json({
                message: "Clear Your Cart First in Order to Add items from this restaurant"
            });
            const cartitem = await cart.findOneAndUpdate({
                userid: userid,
                restid: restid,
                itemid: itemid
            }, {
                $inc: { quantity: 1 },
                $setOnInsert: { userid, restid, itemid }
            }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            });
        }
        return res.status(201).json({
            message: "item added to cart",
            cart
        });
    }
});
export const fetchcart = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Login First"
        });
    }
    const userid = req.user.id;
    const cartitems = await cart.find({ userid }).populate("itemid").populate("restid");
    let subtotal = 0;
    let cartlength = 0;
    for (const item of cartitems) {
        const it = item.itemid;
        subtotal += it.price * item.quantity;
        cartlength += item.quantity;
    }
    return res.status(200).json({
        cartlength,
        subtotal,
        cart: cartitems
    });
});
