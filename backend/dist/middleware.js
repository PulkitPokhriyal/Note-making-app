import jwt, {} from "jsonwebtoken";
import env from "dotenv";
env.config();
function Middleware(req, res, next) {
    const token = req.headers["token"];
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
    if (decoded) {
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            Message: "You are not signed in",
        });
    }
}
export { Middleware };
//# sourceMappingURL=middleware.js.map