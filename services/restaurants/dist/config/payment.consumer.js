import { Order } from "../models/orders.js";
import { getchannel } from "./rabbitmq.js";
export const paymentconsumer = async () => {
    const channel = getchannel();
    channel.consume(process.env.PAYMENT_QUEUE, async (msg) => {
        if (!msg) {
            return;
        }
        try {
            const event = JSON.parse(msg.content.toString());
            if (event.type !== "PAYMENT_SUCCESS") {
                channel.ack(msg);
                return;
            }
            const { orderid } = event.data;
            const order = await Order.findOneAndUpdate({
                _id: orderid,
                paymentstatus: { $ne: "paid" },
            }, {
                $set: {
                    paymentstatus: "paid",
                    status: "placed",
                },
                $unset: {
                    expireat: 1
                }
            }, { new: true });
            if (!order) {
                channel.ack(msg);
                return;
            }
            console.log("rest queue order placed", orderid);
            channel.ack(msg);
        }
        catch (error) {
            console.error("Failed to process payment event:", error);
            channel.nack(msg, false, false);
        }
    });
};
