import { all, call, takeLatest, put, select } from "typed-redux-saga";
import { TASK_ACTION_TYPES, TaskList, Tasktype, createTask, createTaskResponse } from "./taskTypes";
import { AdminTaskListStart, CreateTaskStart, DeleteTaskStart, UpdateStatusStart, UpdateTaskStart, UserTaskListStart, adminTaskListFailure, adminTaskListSuccess, createTaskFailure, createTaskSuccess, deleteTaskFailure, deleteTaskSuccess, updateStatusFailure, updateStatusSuccess, updateTaskFailure, updateTaskSuccess, userTaskListFailure, userTaskListSuccess } from "./taskActions";
import axios from "axios";
import { selectUserReducer } from "../user/userSelector";
import { toast } from "react-toastify";

export function* adminTaskListStart({ payload: { page, username, startDate, endDate, status } }: AdminTaskListStart) {
    const user = yield* select(selectUserReducer);
    try {
        const queryParams = new URLSearchParams();

        if (page !== undefined) queryParams.append('page', page.toString());
        if (username !== undefined && username !== '') queryParams.append('username', username);
        if (startDate !== undefined && startDate !== '') queryParams.append('startDate', startDate);
        if (endDate !== undefined && endDate !== '') queryParams.append('dueDate', endDate);
        if (status !== undefined) queryParams.append('status', status.toString());

        const response = yield* call(axios.get<TaskList>, `${process.env.REACT_APP_API_URL}/api/task/getTasks?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${user.currentUser?.token}`
            }
        })
        if (response.status === 200) {
            const data = response.data;
            yield* put(adminTaskListSuccess(data));
            toast.success('Tasks fetched successfully');
        }
    } catch (error) {
        yield* put(adminTaskListFailure(error as Error));
        toast.error('Something went wrong');
    }
}

export function* userTaskListStart({ payload: { page, status } }: UserTaskListStart) {
    const user = yield* select(selectUserReducer);
    try {
        const queryParams = new URLSearchParams();

        if (page !== undefined) queryParams.append('page', page.toString());
        if (status !== undefined) queryParams.append('status', status.toString());

        const response = yield* call(axios.get<TaskList>, `${process.env.REACT_APP_API_URL}/api/task/getUserTasks?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${user.currentUser?.token}`
            }
        })
        if (response.status === 200) {
            const data = response.data;
            yield* put(userTaskListSuccess(data));
            toast.success('Tasks fetched successfully');
        }
    } catch (error) {
        yield* put(userTaskListFailure(error as Error));
        toast.error('Something went wrong');
    }
}

export function* createTaskStart({ payload: { name, description, startDate, dueDate, userId } }: CreateTaskStart) {
    const user = yield* select(selectUserReducer);
    try {
        const response = yield* call(axios.post<createTaskResponse>, `${process.env.REACT_APP_API_URL}/api/task/createtask`, { name, description, startDate, dueDate, userId }, {
            headers: {
                Authorization: `Bearer ${user.currentUser?.token}`
            }
        })
        if (response.status === 201) {
            const data = response.data;
            yield* put(createTaskSuccess());
            toast.success('Task created successfully');
        }
    } catch (err) {
        yield* put(createTaskFailure(err as Error));
        toast.error((err as Error).message);
    }
}

export function* deleteTaskStart({ payload: taskId }: DeleteTaskStart) {
    const user = yield* select(selectUserReducer);
    console.log(taskId);
    try {
        const response = yield* call(axios.delete<{ message: string }>, `${process.env.REACT_APP_API_URL}/api/task/deletetask`, {
            headers: {
                Authorization: `Bearer ${user.currentUser?.token}`
            },
            data: { taskId }
        })
        if (response.status === 200) {
            yield* put(deleteTaskSuccess());
            toast.success('Task deleted successfully');
        }
    } catch (err) {
        yield* put(deleteTaskFailure(err as Error));
        toast.error((err as Error).message);
    }
}

export function* updateTaskStart({ payload: {id:taskId, name, description, startDate, dueDate, completionDate,userId } }: UpdateTaskStart) {
    const user = yield* select(selectUserReducer);
    try {
        if(completionDate==='') completionDate=null;


        const response = yield* call(axios.put<{message: string,data:Tasktype}>, `${process.env.REACT_APP_API_URL}/api/task/updatetask`, {taskId,name, description, startDate, dueDate, completionDate,userId}, {
            headers: {
                Authorization: `Bearer ${user.currentUser?.token}`
            }
        })
        if (response.status === 200) {
            const {data} = response.data
            yield* put(updateTaskSuccess(data));
            toast.success('Task updated successfully');
        }
    } catch (err) {
        yield* put(updateTaskFailure(err as Error));
        toast.error('Something went wrong');
    }
}

export function* updateStatusStart({ payload: {id:taskId, status} }: UpdateStatusStart) {
    const user = yield* select(selectUserReducer);
    try {
        const response = yield* call(axios.put<{message: string,data:Tasktype}>, `${process.env.REACT_APP_API_URL}/api/task/updateStatus`, {taskId,status}, {
            headers: {
                Authorization: `Bearer ${user.currentUser?.token}`
            }
        })
        if (response.status === 200) {
            const {data} = response.data
            yield* put(updateStatusSuccess(data));
            toast.success('Task status updated successfully');
        }
    } catch (err) {
        yield* put(updateStatusFailure(err as Error));
        toast.error('Something went wrong');
    }
}

// onstart

export function* onCreateTaskStart() {
    yield* takeLatest(TASK_ACTION_TYPES.CREATE_TASK_START, createTaskStart)
}

export function* onAdminTaskListStart() {
    yield* takeLatest(TASK_ACTION_TYPES.ADMIN_TASK_LIST_START, adminTaskListStart)
}

export function* onUserTaskListStart() {
    yield* takeLatest(TASK_ACTION_TYPES.USER_TASK_LIST_START, userTaskListStart)
}

export function* onDeleteTaskStart() {
    yield* takeLatest(TASK_ACTION_TYPES.DELETE_TASK_START, deleteTaskStart)
}

export function* onUpdateTaskStart() {
    yield* takeLatest(TASK_ACTION_TYPES.UPDATE_TASK_START, updateTaskStart)
}

export function* onUserStatusChangeStart() {
    yield* takeLatest(TASK_ACTION_TYPES.UPDATE_STATUS_START, updateStatusStart)
}

export function* taskSagas() {
    yield* all([call(onCreateTaskStart), call(onDeleteTaskStart), call(onUpdateTaskStart), call(onAdminTaskListStart), call(onUserTaskListStart),call(onUserStatusChangeStart)])
}