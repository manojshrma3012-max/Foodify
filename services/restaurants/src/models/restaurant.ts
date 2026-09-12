import mongoose,{Document,mongo,Number,Schema} from "mongoose";
export interface Irestaurant extends Document{
    name : string,
    image : string,
    ownerId : string,
    PhoneNo : Number,
    description?:string,
    isverified:boolean

    autolocation :{
        type:"Point",
        coordinates : [number,number]
        formattedAddress:string
    }
    isOpen:boolean,
    createdAt:Date
}
const schema = new Schema<Irestaurant>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description: String,
    image:{
        type:String,
        required:true
    },
    ownerId:{
        type:String,
        required:true
    },
    PhoneNo:{
        type:Number,
        required:true
    },
    isverified:{
        type:Boolean,
        required:true
    },
    autolocation:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
        formattedAddress:{
            type:String,
            required:true
        }
    },
    isOpen:{
        type:Boolean
    }

},{timestamps:true})
schema.index({autolocation:"2dsphere"})
export default mongoose.model<Irestaurant>("Restaurant",schema)