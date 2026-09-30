import mongoose,{Schema,Document} from "mongoose";
export interface Rider extends Document{
    userId:string,
    image:string,
    phoneNo : string
    adhaarnumber:string
    drivingLiscenseNumber:string
    isverified:boolean
    location:{
        type:"Point",
        coordinates : [Number,Number]
    },
    isAvailable : boolean
    lastactiveat:Date
    createdAt:Date
    updatedAt:Date
}


const riderSchema = new Schema<Rider>(
    {
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
            unique:true
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
    },
    {
        timestamps: true
    }
)
riderSchema.index({location:"2dsphere"})
export const Rider = mongoose.model<Rider>("Rider",riderSchema)