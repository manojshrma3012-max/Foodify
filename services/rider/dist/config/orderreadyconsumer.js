import axios from "axios";
import { getchannel } from "./connectrabbitmq.js";
import { Rider } from "../models/rider.js";
export const orderreadyconsumer = async () => {
    const channel = getchannel();
    console.log("consuming from order ready");
    channel.consume(process.env.ORDER_READY_QUEUE, async (msg) => {
        if (!msg)
            return;
        try {
            console.log("received message");
            const event = JSON.parse(msg.content.toString());
            console.log(event.type);
            if (event.type !== "ORDER_READY_FOR_RIDER") {
                console.log("skipping non-roder ready for rider");
                channel.ack(msg);
                return;
            }
            const { orderid, restid, location } = event.data;
            console.log("searching for rider nearby", location);
            const riders = await Rider.find({
                isAvailable: true,
                isverified: true,
                location: {
                    $near: {
                        $geometry: location,
                        $maxDistance: 200000
                    }
                }
            });
            console.log("founded riders :", riders);
            if (riders.length === 0) {
                console.log("no riders available nearby");
                channel.ack(msg);
                return;
            }
            for (const rider of riders) {
                try {
                    await axios.post(`${process.env.REALTIME_SERVICE}/api/v1/internal/emit`, {
                        event: "order:ready",
                        room: `user:${rider.userId}`,
                        payload: {
                            orderid,
                            restid
                        }
                    }, {
                        headers: {
                            "x-internal-key": process.env.INTERNAL_KEY
                        }
                    });
                    console.log("Notified riders");
                }
                catch (error) {
                    console.log(error);
                }
            }
            channel.ack(msg);
        }
        catch (error) {
            console.log(error);
        }
    });
};
