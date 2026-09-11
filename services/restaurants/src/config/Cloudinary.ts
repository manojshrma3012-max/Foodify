import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
 cloudinary.config({
    api_key : process.env.CLOUDINARY_API_KEY as string,
    api_secret : process.env.CLOUDINARY_API_SECRET as string,
    cloud_name : process.env.CLOUDINARY_NAME as string
})
export default cloudinary