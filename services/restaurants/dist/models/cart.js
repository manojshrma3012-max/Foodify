import mongoose, { Schema } from 'mongoose';
const schema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    restid: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    itemid: {
        type: Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
}, { timestamps: true });
schema.index({ userid: 1, restid: 1, itemid: 1 }, { unique: true });
export default mongoose.model("cart", schema);
