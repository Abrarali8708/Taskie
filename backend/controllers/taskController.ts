import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import Tasks from '../models/tasks';
import User from '../models/users';
import { authenticatedRequest } from '../middleware/verifyToken';
import router from '../routes/auth';
import moment from 'moment-timezone';
dotenv.config();

const updatedStatusFunction = (state: Tasks & { updatedStatus?: string }) => {
    const currentDate = moment().local().startOf('day');
    if (state.completionDate) {
        if (moment(state.completionDate).local().isAfter(moment(state.dueDate))) {
            state.updatedStatus = 'Late Completed';
        } else {
            state.updatedStatus = 'Completed';
        }
    } else if (moment(state.dueDate).isBefore(currentDate)) {
        state.updatedStatus = 'Overdue';
    } else if (moment(state.startDate).isAfter(currentDate)) {
        state.updatedStatus = 'Upcoming'
    } else {
        state.updatedStatus = 'Pending';
    }
}

export const createTask = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors.array());
    }

    const name: string = req.body.name;
    const description: string = req.body.description;
    const startDate: Date = moment(req.body.startDate).local().toDate();
    const dueDate: Date = moment(req.body.dueDate).local().toDate();
    const userId: number = req.body.userId;
    const adminId: number = req.user.id;
    console.log('startdate',startDate,dueDate);
    const user = await User.query().findOne({ id: userId });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (user.companyName !== req.user.company) {
        return res.status(400).json({ message: 'User not found in your Company' });
    }

    const currentDate = moment().local().startOf('day');
    if (moment(startDate).isBefore(currentDate)) {
        return res.status(400).json({ message: 'Start Date cannot be in the past' });
    }

    if (moment(dueDate).isBefore(startDate)) {
        return res.status(400).json({ message: 'Start date cannot be after Due date' });
    }

    try {

        const task = await Tasks.query().insertGraph({
            name,
            description,
            startDate,
            dueDate,
            userId,
            adminId
        }, { allowRefs: true })

        res.status(201).json({
            message: 'taskCreated',
            data: task
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updatetask = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors.array());
    }
    const { taskId, name, description, startDate, dueDate, userId, completionDate }: {
        taskId: number,
        name?: string,
        description?: string,
        startDate?: Date,
        dueDate?: Date,
        completionDate?: Date,
        userId?: number
    } = req.body;
    try {
        const task = await Tasks.query().findById(taskId);
        if (!task) {
            return res.status(400).json({ message: 'Task not found' });
        }

        if (name) task.name = name;
        if (description) task.description = description;
        if (startDate) task.startDate = moment(startDate).local().toDate();
        if (dueDate) task.dueDate = moment(dueDate).local().toDate();
        if (userId) task.userId = userId;
        if (completionDate) {
            task.completionDate = moment(completionDate).local().toDate();
            task.status = true;
        } else {
            task.status = false;
            task.completionDate = null;
        }

        const user = await User.query().findOne({ id: task.userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.companyName !== req.user.company) {
            return res.status(400).json({ message: 'User not found in your Company' });
        }


        // if (startDate && moment(startDate).isBefore(moment().local().startOf('day'))) {
        //     return res.status(400).json({ message: 'Start Date cannot be in the past' });
        // }
        if (dueDate && moment(dueDate).isBefore(startDate)) {
            return res.status(400).json({ message: 'Start Date cannot be after Due Date' });
        }

        const updatedTask: (Tasks & { updatedStatus?: string }) = await Tasks.query().upsertGraph(task).withGraphFetched('user').modifyGraph('user', builder => {
            builder.select('username')
        });;

        updatedStatusFunction(updatedTask);

        res.status(200).json({
            message: 'taskUpdated',
            data: updatedTask
        });

    } catch (err) {
        res.status(500).json(err);
    }
}

export const deleteTask = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors.array());
    }

    const taskId: number = req.body.taskId;
    try {
        await Tasks.query().deleteById(taskId);

        res.status(200).json({
            message: 'taskDeleted'
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getTasks = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors.array());
    }

    const currentPage: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const itemsPerPage: number = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage as string) : 8;
    const { username, startDate, dueDate, status }: {
        username?: string,
        startDate?: Date,
        dueDate?: Date,
        status?: number
    } = req.query;
    try {
        let totalSizeQuery = Tasks.query().where('adminId', req.user.id);
        let tasksQuery = Tasks.query().where('adminId', req.user.id).offset((currentPage - 1) * itemsPerPage).limit(itemsPerPage).withGraphFetched('user').modifyGraph('user', builder => {
            builder.select('username')
        });
        if (username) {
            totalSizeQuery = totalSizeQuery.joinRelated('user').where('user.username', username);
            tasksQuery = tasksQuery.joinRelated('user').where('user.username', username);
        }

        if (startDate) {
            totalSizeQuery = totalSizeQuery.where('startDate', '>=', moment(startDate).local().toDate());
            tasksQuery = tasksQuery.where('startDate', '>=', moment(startDate).local().toDate());
        }

        if (dueDate) {
            totalSizeQuery = totalSizeQuery.where('dueDate', '<=', moment(dueDate).local().toDate());
            tasksQuery = tasksQuery.where('dueDate', '<=', moment(dueDate).local().toDate());
        }

        if (status) {
            totalSizeQuery = totalSizeQuery.where('status', status);
            tasksQuery = tasksQuery.where('status', status);
        }

        const totalSize = await totalSizeQuery;
        // if (totalSize.length <= (currentPage - 1) * itemsPerPage) {
        //     return res.status(422).json('Page not found');
        // }
        const tasks: (Tasks & { updatedStatus?: string })[] = await tasksQuery;
        tasks.forEach(task => {
            updatedStatusFunction(task);
        })

        res.status(200).json({
            tasks,
            totalSize: totalSize.length
        });

    } catch (err) {
        res.status(500).json(err);
    }
}

export const getTasksByUser = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors.array());
    }
    const currentPage: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const itemsPerPage: number = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage as string) : 8;
    const { status }: { status?: number } = req.query;
    try {
        let totalSizeQuery = Tasks.query().where('userId', req.user.id);
        let tasksQuery = Tasks.query().where('userId', req.user.id).offset((currentPage - 1) * itemsPerPage).limit(itemsPerPage)
        if (status) {
            totalSizeQuery = totalSizeQuery.where('status', status);
            tasksQuery = tasksQuery.where('status', status);
        }

        const totalSize = await totalSizeQuery;
        if (totalSize.length < (currentPage - 1) * itemsPerPage) {
            return res.status(422).json('Page not found');
        }
        const tasks: (Tasks & { updatedStatus?: string })[] = await tasksQuery;
        tasks.forEach(task => {
            updatedStatusFunction(task)
        })
        res.status(200).json({
            tasks,
            totalSize: totalSize.length
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updateStatus = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json(errors.array());
    }

    const { taskId, status }: { taskId: number, status: number } = req.body;
    console.log('date', moment().toDate());
    try {
        if (moment().local().isBefore(moment(req.user.startDate).local())) {
            return res.status(403).json('You can not update tasks before your start date');
        }

        const task: Tasks & { updatedStatus?: string } = await Tasks.query().updateAndFetchById(taskId, {
            status:status===1 ? true : false,
            completionDate: status === 1 ? moment().local().toDate() : null
        })
        updatedStatusFunction(task);
        res.status(200).json({ message: 'Status updated successfully', data: task });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const adminDashboard = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const today = moment().local().startOf('day');
        const sevenDaysAgo = moment().local().subtract(6, 'days').toDate();

        const tasks = await Tasks.query().where('adminId', req.user.id);
        console.log(tasks);
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === true).length;
        const pendingTasks = tasks.filter(task => task.status === false).length;
        const tasksCompletedToday = tasks.filter(task => (task.status === true && moment(task.completionDate).local().isSame(today, 'day'))).length;
        const overdueTasks = tasks.filter(task => (task.status === false && moment(task.dueDate).local().isBefore(today))).length;

        const tasksCompletedInWeek = tasks
            .filter(task => (task.status === true && moment(task.completionDate).local().isBetween(sevenDaysAgo, today, 'day', '[]')))
            .reduce((acc: { [date: string]: number }, task) => {
                const completionDate = moment(task.completionDate).local().format('YYYY-MM-DD');
                acc[completionDate] = (acc[completionDate] || 0) + 1;
                return acc;
            }, {})

        const taskCompletedPerDay: { [date: string]: number } = {};
        for (let i = 0; i < 7; i++) {
            const date = moment().local().subtract(i, 'days').format('YYYY-MM-DD');
            taskCompletedPerDay[date] = tasksCompletedInWeek[date] || 0;
        }

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            tasksCompletedToday,
            overdueTasks,
            taskCompletedPerDay
        })
    } catch (err) {
        console.log(err);
    }
}

export const userDashboard = async (req: authenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const today = moment().local().startOf('day');
        const tasks = await Tasks.query().where('userId', req.user.id);
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === true).length;
        const overdueTasks = tasks.filter(task => task.status === false).filter(task => {
            if (moment(task.dueDate).isBefore(today)) {
                return task;
            }
        }).length;
        const pendingTasks = tasks.filter(task => task.status === false).filter(task => {
            if (moment(task.startDate).isBefore(today) && moment(task.dueDate).isAfter(today)) {
                return task;
            }
        }).length;

        res.status(200).json({
            totalTasks,
            completedTasks,
            overdueTasks,
            pendingTasks
        })
    } catch (err) {
        res.status(500).json(err);
    }
}