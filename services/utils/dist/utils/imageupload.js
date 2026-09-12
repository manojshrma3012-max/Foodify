import { Readable } from 'node:stream';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
});
export async function uploadImage(buffer, folder) {
    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream({
            folder: folder,
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            if (!result) {
                reject(new Error("cloudinary upload failed"));
                return;
            }
            resolve(result);
        });
        Readable.from([buffer]).pipe(upload);
    });
}
