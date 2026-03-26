import {Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/express.js";

export const Authorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: No token provided'
            });
        }

        const realToken = token.split(' ')[1];

    

        const decoded = jwt.verify(realToken, process.env.ACCESS_TOKEN!) as TokenPayload

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: error instanceof jwt.JsonWebTokenError ? error.message : 'Unauthorized: Invalid token'
        })
    }
}


const authorizationMiddleware = {
  Authorization   
}

export default authorizationMiddleware