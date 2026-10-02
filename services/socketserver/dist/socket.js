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
            if (typeof decoded !== "object" || decoded === null) {
                return next(new Error("Unauthorized"));
            }
            const tokenUser = decoded.tokendata ?? decoded.user ?? decoded;
            if (typeof tokenUser !== "object" ||
                tokenUser === null ||
                typeof tokenUser.id !== "string") {
                return next(new Error("Unauthorized"));
            }
            const user = { id: tokenUser.id };
            if (typeof tokenUser.restID === "string") {
                user.restID = tokenUser.restID;
            }
            socket.data.user = user;
            next();
        }
        catch (error) {
            console.log(error, "socket error");
            next(new Error("Unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        const user = socket.data.user;
        console.log(user);
        if (!user) {
            socket.disconnect();
            return;
        }
        const userid = user.id;
        socket.join(`user:${userid}`);
        if (user.restID) {
            socket.join(`restaurant:${user.restID}`);
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
