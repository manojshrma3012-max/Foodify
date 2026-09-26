import TryCatch from "../middlewares/trycatch.js";
import Address from "../models/Address.js";
import cart from "../models/cart.js";
import restaurant from "../models/restaurant.js";
import { Order } from "../models/orders.js";
export const createorder = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const { paymentmethod, addressid } = req.body;
    if (!addressid) {
        return res.status(400).json({
            message: "address required"
        });
    }
    const address = await Address.findOne({
        _id: addressid,
        userId: user.id
    });
    if (!address) {
        return res.status(404).json({
            message: "address not found"
        });
    }
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dlat = ((lat2 - lat1) * Math.PI) / 180;
        const dlon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dlon / 2) *
                Math.sin(dlon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return +(R * c).toFixed(2);
    };
    const cartitems = await cart.find({
        userid: user.id
    }).populate("itemid").populate("restid");
    if (cartitems.length === 0) {
        return res.status(400).json({
            message: "Cart is Empty"
        });
    }
    console.log(cartitems);
    const firstcartitem = cartitems[0];
    if (!firstcartitem || !firstcartitem.restid) {
        return res.status(400).json({
            message: "Invalid Cart data"
        });
    }
    const restid = firstcartitem.restid._id;
    console.log(restid);
    const rest = await restaurant.findById(restid);
    if (!rest) {
        return res.status(404).json({
            message: "No Restaurant Found"
        });
    }
    if (!rest.isOpen) {
        return res.status(404).json({
            message: "Restaurant Is closed"
        });
    }
    const distance = getDistance(address.location.coordinates[1], address.location.coordinates[0], rest.autolocation.coordinates[1], rest.autolocation.coordinates[0]);
    let subtotal = 0;
    const orderitem = cartitems.map((cart) => {
        const item = cart.itemid;
        if (!item) {
            throw new Error("Invalid Cart");
        }
        const itemtotal = item.price * cart.quantity;
        subtotal += itemtotal;
        return {
            itemid: item._id.toString(),
            name: item.name,
            price: item.price,
            quantity: cart.quantity
        };
    });
    const deliveryfee = subtotal < 250 ? 49 : 0;
    const platformfee = 7;
    const totalamount = subtotal + deliveryfee + platformfee;
    const expireat = new Date(Date.now() + 15 * 60 * 1000);
    const [longitude, latitude] = address.location.coordinates;
    const rideramount = Math.ceil(distance) * 17;
    const order = await Order.create({
        subtotal,
        userId: user.id.toString(),
        restid: rest._id.toString(),
        restname: rest.name,
        riderId: null,
        items: orderitem,
        deliveryfee, platformfee, totalamount,
        addressid: address._id.toString(),
        deliveryaddress: {
            formattedAddredd: address.formattedAddress,
            mobileno: address.mobile,
            latitude,
            longitude
        },
        paymentmethod: paymentmethod,
        distance,
        rideramount,
        paymentstatus: "pending",
        status: "placed",
        expireat: expireat
    });
    // await cart.deleteMany({userid:user.id})
    return res.status(201).json({
        message: "Order Created Successfully",
        orderId: order._id.toString(),
        amount: totalamount
    });
});
export const fetchorderforpayment = TryCatch(async (req, res) => {
    if (req.headers["x-internal-key"] !== process.env.INTERNAL_KEY) {
        return res.status(403).json({
            message: "forbiddden"
        });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(400).json({
            message: "order not found"
        });
    }
    if (order.paymentstatus !== "pending") {
        return res.status(400).json({
            message: "Payment Done"
        });
    }
    res.json({
        orderid: order._id,
        amount: order.totalamount,
        currency: "INR"
    });
});
export const fetchRestaurantOrders = TryCatch(async (req, res) => {
    const user = req.user;
    const { restid } = req.params;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorised"
        });
    }
    if (!restid) {
        return res.status(400).json({
            message: "No rest found"
        });
    }
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const orders = await Order.find({ restid: restid, paymentstatus: "paid" }).sort({ createdAt: -1 }).limit(limit);
    return res.json({
        success: true,
        count: orders.length,
        orders
    });
});
const ALLOWED_STATUS = ["accepted", "preparing", "ready_for_rider"];
export const updateorderstatus = TryCatch(async (req, res) => {
    const user = req.user;
    const { orderid } = req.params;
    const { status } = req.body;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorised"
        });
    }
    if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({
            message: "Invalid Order Status"
        });
    }
    const order = await Order.findById(orderid);
    if (!ordder) {
        return res.status(404).json({
            message: "order not found"
        });
    }
});
