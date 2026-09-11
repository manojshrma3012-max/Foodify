import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`auth service running on ${PORT}`);
    connectDb();
});
