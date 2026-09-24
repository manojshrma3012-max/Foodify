import axios from 'axios';
import { razorpay } from '../config/razorpay.js';
import { verifysign } from '../config/verifyrazorpay.js';
import { paymentpublishsuccess } from '../config/payment.producer.js';
export const createrazorpayorder = async (req, res) => {
    try {
        const { orderid } = req.body;
        console.log("Order ID:", orderid);
        const { data } = await axios.get(`${process.env.REST_SERVICE_URL}/api/order/get-order/${orderid}`, {
            headers: {
                "x-internal-key": process.env.INTERNAL_KEY
            }
        });
        console.log("Order data:", data);
        const razorpayorder = await razorpay.orders.create({
            amount: data.amount,
            currency: "INR",
            receipt: data.orderid
        });
        console.log("Razorpay order:", razorpayorder);
        res.json({
            razorpayorderid: razorpayorder.id,
            // IMPORTANT: this is the KEY ID, not SECRET
            key: process.env.RAZORPAY_KEY_ID,
            // Your frontend needs this
        });
    }
    catch (error) {
        console.log("========== RAZORPAY ERROR ==========");
        console.log("ERROR:", error);
        console.log("JSON:", JSON.stringify(error, null, 2));
        console.log("====================================");
        return res.status(500).json({
            message: "Failed to create Razorpay order",
            error: error
        });
    }
};
export const razorpayverify = async (req, res) => {
    const { razorpayorderid, razorpaypaymentid, razorpay_signature, orderid } = req.body;
    const isvalid = verifysign(razorpayorderid, razorpaypaymentid, razorpay_signature);
    console.log(isvalid);
    if (!isvalid) {
        return res.status(400).json({
            message: "payment verification failed"
        });
    }
    await paymentpublishsuccess({
        orderid,
        paymentid: razorpaypaymentid,
        provider: "razorpay"
    });
    res.json({
        message: "Payment verified successfully"
    });
};
