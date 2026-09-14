import { Router } from 'express';
import { uploadImage } from '../utils/imageupload.js';
const uploadroutes = Router();
import multer from 'multer';
const storage = multer.memoryStorage();
const uploadfile = multer({ storage }).single("file");
uploadroutes.post('/uploads', uploadfile, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(401).json({
                message: "file required"
            });
        }
        const { folder } = req.body;
        const buffer = req.file.buffer;
        console.log(req.body);
        const data = await uploadImage(buffer, folder);
        res.status(200).json({
            message: "image uploaded successfully",
            url: data.secure_url
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});
export default uploadroutes;
