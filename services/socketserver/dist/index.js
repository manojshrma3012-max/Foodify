import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { initSocket } from './socket.js';
const app = express();
app.use(cors());
dotenv.config();
const server = http.createServer(app);
initSocket(server);
server.listen(process.env.PORT, () => {
    console.log(`Realtime server running on ${process.env}`);
});
