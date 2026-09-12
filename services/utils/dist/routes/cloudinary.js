import { Router } from 'express';
import { uploadImage } from '../utils/imageupload.js';
const uploadroutes = Router();
uploadroutes.post('/uploads', async (req, res) => {
    try {
        const { buffer, folder } = req.body;
        const data = await uploadImage(buffer, folder);
        res.status(200).json({
            message: "image uploaded successfully",
            url: data.secure_url
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
export default uploadroutes;
