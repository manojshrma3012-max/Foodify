import mongoose, { Schema } from "mongoose";
const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    image: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    PhoneNo: {
        type: Number,
        required: true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    autolocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: {
            type: String,
            required: true
        }
    },
    isOpen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
schema.index({ autolocation: "2dsphere" });
export default mongoose.model("Restaurant", schema);
