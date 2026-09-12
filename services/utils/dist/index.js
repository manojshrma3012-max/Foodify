import express from 'express';
const app = express();
app.use(express.json());
dotenv.config();
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`utils running on ${PORT}`);
});
