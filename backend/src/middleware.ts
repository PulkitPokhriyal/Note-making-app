import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "dotenv";

env.config();

function Middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["token"] as string;
  const decoded = jwt.verify(token as string, process.env.JWT_PASSWORD!);
  if (decoded) {
    req.userId = (decoded as JwtPayload).id;
    next();
  } else {
    res.status(403).json({
      Message: "You are not signed in",
    });
  }
}

export { Middleware };
