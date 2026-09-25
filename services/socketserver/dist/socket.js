import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Unauthorized"));
            }
            const decoded = jwt.verify(token, process.env.SECRET);
            if (!decoded || !decoded.user) {
                return next(new Error("Unauthorized"));
            }
            socket.data.user = decoded.user;
            next();
        }
        catch (error) {
            console.log(error, "socket error");
            next(new Error("Unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;
        if (!user) {
            socket.disconnect();
            return;
        }
        const userid = user.id;
        socket.join(`user:${userid}`);
        if (user.restid) {
            socket.join(`restaurant:${user.restid}`);
        }
        console.log("User connected:", userid);
        console.log("Socket rooms:", [...socket.rooms]);
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userid}`);
        });
    });
};
export const getio = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io; // ⭐ this was missing
};
