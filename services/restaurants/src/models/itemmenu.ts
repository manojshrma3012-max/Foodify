import mongoose,{Schema,Document} from "mongoose";
export interface menuItems extends Document{
    restID : mongoose.Types.ObjectId,
    name : string,
    description : string,
    image : string,
    price : number,
    inStock : boolean,
    createdAt:Date,
    updatedAt:Date
}

const menuSchema = new Schema<menuItems>({
    restID :{
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required:true,
        index:true
    },
    name : {
        type:String,
        required:true,
        trim : true
    },
    image : {
        type:String,
        required:true,
    },
    description : {
        type:String,
        trim : true
    },
    price : {
        type:Number,
        required:true,
    },
    inStock:{
        type:Boolean,
        required:true,
    }
},{
    timestamps:true
})

export default mongoose.model("Menu",menuSchema)

