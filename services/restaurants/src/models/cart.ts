import mongoose ,{Schema,Document} from 'mongoose'
export interface cartschema extends Document{
    userid : mongoose.Types.ObjectId;
    restid : mongoose.Types.ObjectId
    itemid : mongoose.Types.ObjectId
    quantity : number
    createdAt : Date
    updatedAt:Date 
}
const schema = new Schema<cartschema>({
    userid:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true
    },
    restid:{
        type:Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true,
        index:true
    },
    itemid:{
        type:Schema.Types.ObjectId,
        ref:"Menu",
        required:true,
        index:true
    },
    quantity:{
        type:Number,
        default:1,
        min:1
    }
},{timestamps:true})
schema.index({userid:1,restid:1,itemid:1},{unique:true})
export default mongoose.model<cartschema>("cart",schema)