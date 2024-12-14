import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/users';
import { authenticatedRequest } from '../middleware/verifyToken';

export const getCompanyNames = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const companies = (await User.query().where('isAdmin',true).select('companyName')) as {companyName:string}[];
        res.status(200).json(companies);
    }catch(err){
        res.status(500).json(err);
    }
}

export const getUsersList = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const {company} = req.user;
    try{
        const usersList = await User.query().where('isAdmin',false).where('companyName',company).select('username','id');
        res.status(200).json(usersList);
    }catch(err){
        res.status(500).json(err);
    }
}