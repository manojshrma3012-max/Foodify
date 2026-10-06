import TryCatch from '../middlewares/trycatch.js';
import { getrestacollection } from '../utils/collection.js';
export const getpendingrest = TryCatch(async (req, res) => {
    const restaurant = await (await getrestacollection()).find({
        isVerified: false
    }).toArray();
    console.log(restaurant);
    res.json({
        count: restaurant.length,
        restaurant
    });
});
export const getpendingriders = TryCatch(async (req, res) => {
    const riders = await (await getrestacollection()).find({
        isVerified: false
    }).toArray();
    console.log(riders);
    res.json({
        count: riders.length,
        riders
    });
});
