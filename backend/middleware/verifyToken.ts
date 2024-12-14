import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export interface authenticatedRequest extends Request{
    user?:any
}

export const verifyToken = (req:authenticatedRequest,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token=authHeader.split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY as string,(err,user)=>{
            if(err) {
                return res.status(403).json("Invalid Token");
            }
            req.user=user;
            next();
        });
    }else{
        return res.status(401).json("you are not authenticated");
    }
}
