import express from 'express';
import { body } from 'express-validator';
import {getCompanyNames,getUsersList} from '../controllers/dataController';
import { verifyToken } from '../middleware/verifyToken';
const router = express.Router();

router.get('/companyNames',getCompanyNames);

router.get('/usersList',verifyToken,getUsersList);


export default router;