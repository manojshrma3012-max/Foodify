import {UploadApiErrorResponse, UploadApiResponse} from 'cloudinary'
import {Readable} from 'node:stream'
import cloudinary from '../config/Cloudinary.js'
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