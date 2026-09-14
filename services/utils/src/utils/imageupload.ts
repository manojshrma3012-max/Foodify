import {UploadApiErrorResponse, UploadApiResponse} from 'cloudinary'
import {Readable} from 'node:stream'
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()


cloudinary.config({
    api_key : process.env.CLOUDINARY_API_KEY as string,
    api_secret : process.env.CLOUDINARY_SECRET as string,
    cloud_name : process.env.CLOUDINARY_NAME as string
})

export async function uploadImage(buffer:Buffer,folder:string):Promise<UploadApiResponse>{
    return new Promise((resolve,reject)=>{
        const upload = cloudinary.uploader.upload_stream({
            folder : folder,
        }, (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if(error){
                reject(error)
                return
            }
            if(!result){
                reject(new Error("cloudinary upload failed"))
                return
            }
            resolve(result)
        })
        Readable.from([buffer]).pipe(upload)

    })

}