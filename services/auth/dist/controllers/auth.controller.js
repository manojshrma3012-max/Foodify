import TryCatch from '../middlewares/trycatch.js';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import { oauth2client } from '../config/GoogleAuth.js';
import axios from 'axios';
export const loginuser = TryCatch(async (req, res) => {
    const { code } = req.body;
    console.log("Received code:", code);
    if (typeof code !== "string" || code.length === 0) {
        res.status(400).json({ message: "Google authorization code is required" });
        return;
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const UserRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    console.log("User info from Google:", UserRes.data);
    const { name, email, picture } = UserRes.data;
    let user = await User.findOne({ email });
    const isNewUser = !user;
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const tokendata = { email: user.email, id: user._id.toString(), name: user.name.toString(), role: user.role ? user.role.toString() : null, image: user.image ? user.image.toString() : null };
    const token = jwt.sign(tokendata, process.env.SECRET, {
        expiresIn: '15d'
    });
    res.status(isNewUser ? 201 : 200).json({
        message: isNewUser ? "User Created" : "Login Successful",
        token: token,
        user
    });
    return;
});
const allowedRoles = ["customer", "rider", "seller"];
export const addrole = TryCatch(async (req, res) => {
    console.log(req.user);
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            message: "Unauthorised here"
        });
    }
    const role = req.body.Roles;
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: " No aloowd Roles"
        });
    }
    const user = await User.findByIdAndUpdate(req.user.id, { role }, { new: true });
    if (!user) {
        return res.status(400).json({
            message: "No User Found"
        });
    }
    const tokendata = { email: user.email, id: user._id.toString(), name: user.name.toString(), role: user.role.toString(), image: user.image ? user.image.toString() : null };
    const token = jwt.sign(tokendata, process.env.SECRET, {
        expiresIn: '15d'
    });
    res.status(201).json({
        message: "User Created",
        user: user,
        token: token
    });
});
export const getme = TryCatch((req, res) => {
    const user = req.user;
    res.status(200).json({
        user
    });
});
