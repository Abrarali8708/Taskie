import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const username:string = req.body.username;
    const password:string = req.body.password;
    const isAdmin:boolean = req.body.isAdmin;
    const companyName:string = req.body.companyName;

    try {
        if(isAdmin){
            const companies = (await User.query().where('isAdmin',true).select('companyName')) as {companyName:string}[];
            if(companies.some(company=>company.companyName===companyName)){
                return res.status(400).json({message:'Company already exists'})
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user =await User.query().insert({
            username,
            password: hashedPassword,
            isAdmin,
            companyName
        })

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            company:user.companyName
        },
            process.env.SECRET_KEY as string, { expiresIn: '12h' }
        );

        res.status(201).json({
            message: 'registerSuccess',
            user:{
                id:user.id,
                username:user.username,
                isAdmin:user.isAdmin,
                companyName:user.companyName,
                token:token
            }
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }

    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.query().findOne({ username: username })
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            company:user.companyName
        },
            process.env.SECRET_KEY as string, { expiresIn: '12h' }
        );


        res.status(200).json({user:{ token: token,id:user.id,username:user.username,isAdmin:user.isAdmin ? true : false,companyName:user.companyName},message:'loginSuccess' })
    } catch (err) {
        res.status(500).json(err);
    }
}

