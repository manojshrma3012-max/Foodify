import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    restid: {
        type: String,
        required: true,
    },
    restname: {
        type: String,
        required: true,
    },
    riderId: {
        type: String,
        default: null,
    },
    riderphoneno: {
        type: Number,
        default: null,
    },
    ridername: {
        type: String,
        default: null,
    },
    distance: {
        type: Number,
        required: true,
    },
    rideramount: {
        type: Number,
        required: true,
    },
    items: [
        {
            itemid: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    subtotal: {
        type: Number,
        required: true,
    },
    deliveryfee: {
        type: Number,
        required: true,
    },
    platformfee: {
        type: Number,
        required: true,
    },
    totalamount: {
        type: Number,
        required: true,
    },
    addressid: {
        type: String,
        required: true,
    },
    deliveryaddress: {
        formattedAddredd: {
            type: String,
            required: true,
        },
        mobileno: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    status: {
        type: String,
        enum: [
            "placed",
            "accepted",
            "preparing",
            "ready_for_rider",
            "rider-assigned",
            "picked-up",
            "delivered",
            "cancelled",
        ],
        default: "placed",
    },
    paymentmethod: {
        type: String,
        enum: ["razorpay", "stripe"],
        required: true,
    },
    paymentstatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    expireat: {
        type: Date,
        index: { expireAfterSeconds: 0 }
    },
}, {
    timestamps: true,
});
export const Order = mongoose.model("Order", orderSchema);
