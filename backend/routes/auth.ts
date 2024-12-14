import express from 'express';
import {body} from 'express-validator';
import User from '../models/users';
import {register,login} from '../controllers/authController';
const router = express.Router();

router.post('/register',[
    body('username')
    .trim()
    .isLength({min:3}).withMessage('Username Length must be atleast 3 characters')
    .custom(async(value,{req})=>{
        return User.query().where({username:value})
        .then((result)=>{
            if(result.length!==0){
                return Promise.reject('User already exists')
            }
        })
    }),
    body('password')
    .trim()
    .isLength({min:6}).withMessage('Password Length must be atleast 6'),
    body('isAdmin')
    .isBoolean()
    .withMessage('isAdmin must be a boolean value'),
    body('companyName')
    .trim()
    .isLength({min:3}).withMessage('Company Name Length must be atleast 3 characters')
],register);

router.post('/login',[
    body('username')
    .trim().isLength({min:3}).withMessage('Username Length must be atleast 3 characters'),
    body('password')
    .trim()
    .isLength({min:6}).withMessage('Password Length must be atleast 6')
],login)



export default router;