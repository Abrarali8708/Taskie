import {Response,Request,NextFunction} from 'express';
import { authenticatedRequest } from './verifyToken';

export const verifyAdmin = (req:authenticatedRequest,res:Response,next:NextFunction)=>{
    if(req.user.isAdmin){
        next();
    }else{
        res.status(401).json('Unauthorized');
    }
}