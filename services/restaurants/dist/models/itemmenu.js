import mongoose, { Schema } from "mongoose";
const menuSchema = new Schema({
    restID: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    inStock: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
});
export default mongoose.model("Menu", menuSchema);
