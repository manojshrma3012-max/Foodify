import jwt from "jsonwebtoken";
export async function authmiddle(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Forbidden No header"
        });
        return;
    }
    const token = header.split(" ")[1];
    if (!token) {
        res.status(401).json({
            message: "Forbidden No token"
        });
        return;
    }
    try {
        const payload = jwt.verify(token, process.env.SECRET);
        const tokenUser = (payload.tokendata ?? payload);
        if (typeof tokenUser.email !== "string" ||
            typeof tokenUser.id !== "string" ||
            typeof tokenUser.name !== "string") {
            res.status(401).json({
                message: "Forbidden Invalid token payload"
            });
            return;
        }
        req.user = {
            email: tokenUser.email,
            id: tokenUser.id,
            name: tokenUser.name,
            role: tokenUser?.role,
            image: tokenUser?.image
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "Forbidden Invalid token"
        });
    }
}
