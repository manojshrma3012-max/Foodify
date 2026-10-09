import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import riderroutes from './routes/rider.js';
import { connectrabbitmq } from './config/connectrabbitmq.js';
import { orderreadyconsumer } from './config/orderreadyconsumer.js';
const app = express();
app.use(cors());
dotenv.config();
await connectrabbitmq();
orderreadyconsumer();
app.use(express.json({ limit: "50 mb" }));
app.use(express.urlencoded({ limit: "50 mb", extended: true }));
app.get('/health', (req, res) => {
    res.send("hello from the server");
});
app.use('/api/rider', riderroutes);
const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
    console.log(`rider running on ${PORT}`);
    connectDb();
});
