import mongoose, { Schema } from "mongoose";
const riderSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    image: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    adhaarnumber: {
        type: String,
        required: true,
        unique: true
    },
    drivingLiscenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    lastactiveat: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
riderSchema.index({ location: "2dsphere" });
export const Rider = mongoose.model("Rider", riderSchema);
