import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig";

interface JwtPayload {
    userId: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            authUser: JwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token not found" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.authUser = {
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};