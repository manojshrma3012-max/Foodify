import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { initSocket } from './socket.js';
import router from './routes/internal.js';
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const server = http.createServer(app);
initSocket(server);
app.use('/api/v1/internal', router);
server.listen(process.env.PORT, () => {
    console.log(`Realtime server running on ${process.env.PORT}`);
});
