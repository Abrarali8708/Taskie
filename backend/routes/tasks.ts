import express from 'express';
import { body,query } from 'express-validator';
import {adminDashboard, createTask, deleteTask, getTasks, getTasksByUser, updateStatus, updatetask, userDashboard} from '../controllers/taskController';
import { verifyToken } from '../middleware/verifyToken';
import {verifyAdmin} from '../middleware/isAdmin';
import User from '../models/users';
import Tasks from '../models/tasks';
const router = express.Router();

router.post('/createtask',verifyToken,verifyAdmin,[
    body('name')
    .trim()
    .isLength({min:3}).withMessage('Name Length must be atleast 3 characters'),
    body('description')
    .trim()
    .isLength({min:10}).withMessage('Description Length must be atleast 10 characters'),
    body('startDate')
    .isISO8601()
    .withMessage('Start Date must be a date'),
    body('dueDate')
    .isISO8601(),
    body('userId')
    .isNumeric()
],createTask);

router.put('/updatetask',verifyToken,verifyAdmin,[
    body('taskId')
    .isNumeric().withMessage('Task Id must be a number')
    .custom(async(value,{req})=>{
        const task = await Tasks.query().findOne({ id: value });
        if (!task) {
            return Promise.reject('Task not found');
        }
    }),
    body('name').optional()
    .trim()
    .isLength({min:3}).withMessage('Name Length must be atleast 3 characters'),
    body('description').optional()
    .trim()
    .isLength({min:10}).withMessage('Description Length must be atleast 10 characters'),
    body('startDate').optional()
    .isISO8601()
    .withMessage('Start Date must be a date'),
    body('dueDate').optional()
    .isISO8601().withMessage('Due Date must be a date'),
    body('userId').optional()
    .isNumeric().withMessage('User Id must be a number'),
    body('completionDate').optional()
    .custom(async(value)=>{
        if(value===null || value===''){
            return true;
        }
        return !isNaN(Date.parse(value))
    }).withMessage('Completion Date must be a valid ISO 8601 date or null'),
],updatetask);

router.delete('/deleteTask',verifyToken,verifyAdmin,[
    body('taskId')
    .isNumeric().withMessage('Task Id must be a number')
    .custom(async(value,{req})=>{
        const task = await Tasks.query().findOne({ id: value });
        if (!task) {
            return Promise.reject('Task not found');
        }
    }),
],deleteTask);

// get all tasks (admin only)
router.get('/getTasks',verifyToken,verifyAdmin,[
    query('page').optional().isInt({min:1}).withMessage('Page Number must be positive'),
    query('itemsPerPage').optional().isInt({min:1,max:10}).withMessage('Items per page must be between 1 and 10'),
    query('username').optional().isString().withMessage('Username must be a string'),
    query('startDate').optional().isISO8601().withMessage('Start Date must be a date'),
    query('dueDate').optional().isISO8601().withMessage('Due Date must be a date'),
    query('status').optional().isNumeric().isIn([0,1]).withMessage('Status must be 0 or 1'),
],getTasks);

// get all tasks (user)
router.get('/getUserTasks',verifyToken,[
    query('page').optional().isInt({min:1}).withMessage('Page Number must be positive'),
    query('itemsPerPage').optional().isInt({min:1,max:10}).withMessage('Items per page must be between 1 and 10'),
    query('status').optional().isNumeric().isIn([0,1]).withMessage('Status must be 0 or 1'),
],getTasksByUser);

// STATUS UPDATE USER
router.put('/updateStatus',verifyToken,[
    body('status')
    .isNumeric()
    .isIn([0,1])
    .withMessage('Status must be 0 or 1'),
    body('taskId')
    .isNumeric()
    .withMessage('Task Id must be a number')
    .custom(async(value,{req})=>{
        const task = await Tasks.query().findOne({ id: value });
        if (!task) {
            return Promise.reject('Task not found');
        }
    }),
],updateStatus);

// ADMIN DASHBOARD API
router.get('/adminDashboard',verifyToken,verifyAdmin,adminDashboard)

// USER DASHBOARD API
router.get('/userDashboard',verifyToken,userDashboard);

export default router;