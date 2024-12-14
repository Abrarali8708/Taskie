import { TaskList, Tasktype } from "./taskTypes";
import { AnyAction } from "redux-saga";
import { adminTaskListFailure, adminTaskListSuccess, clearErrors, createTaskFailure, createTaskSuccess, deleteTaskFailure, deleteTaskSuccess, updateStatusStart, updateStatusSuccess, updateTaskFailure, updateTaskSuccess, userTaskListFailure, userTaskListSuccess } from "./taskActions";

export type TaskState = {
    tasks: Tasktype[];
    totalSize: number;
    isLoading: boolean;
    error: Error | null;
    taskError:Error | null;
}

export const INITIAL_STATE: TaskState = {
    tasks: [],
    totalSize: 0,
    isLoading: false,
    error: null,
    taskError: null
}

export const taskReducer = (state = INITIAL_STATE, action: AnyAction): TaskState => {
    if (userTaskListSuccess.match(action) || adminTaskListSuccess.match(action)) {
        return { ...state, tasks: action.payload.tasks,totalSize:action.payload.totalSize, isLoading: false, error: null}
    }

    if(createTaskSuccess.match(action) || deleteTaskSuccess.match(action) || clearErrors.match(action)){
        return { ...state, isLoading: false, error: null, taskError: null}
    }

    if(createTaskFailure.match(action) || deleteTaskFailure.match(action) || updateTaskFailure.match(action) || adminTaskListFailure.match(action) || userTaskListFailure.match(action)){
        return { ...state, isLoading: false, error: action.payload, taskError: action.payload}
    }

    if(updateTaskSuccess.match(action) || updateStatusSuccess.match(action)){
        return {...state,isLoading:false,error:null,taskError:null,tasks:state.tasks.map(task=>task.id === action.payload.id ? action.payload : task)}
    }

    return state;
}