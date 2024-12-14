import { Action, ActionWithPayload, createAction, withMatcher } from "../../utils/reducer";
import { TASK_ACTION_TYPES, TaskList, Tasktype, createTask, createTaskResponse} from "./taskTypes";

export type CreateTaskStart = ActionWithPayload<TASK_ACTION_TYPES.CREATE_TASK_START,createTask>;
export type CreateTaskSuccess = Action<TASK_ACTION_TYPES.CREATE_TASK_SUCCESS>;
export type CreateTaskFailure = ActionWithPayload<TASK_ACTION_TYPES.CREATE_TASK_FAILED,Error>;

export type UpdateTaskStart = ActionWithPayload<TASK_ACTION_TYPES.UPDATE_TASK_START,Tasktype>;
export type UpdateTaskSuccess = ActionWithPayload<TASK_ACTION_TYPES.UPDATE_TASK_SUCCESS,Tasktype>;
export type UpdateTaskFailure = ActionWithPayload<TASK_ACTION_TYPES.UPDATE_TASK_FAILED,Error>;

export type DeleteTaskStart = ActionWithPayload<TASK_ACTION_TYPES.DELETE_TASK_START,number>;
export type DeleteTaskSuccess = Action<TASK_ACTION_TYPES.DELETE_TASK_SUCCESS>;
export type DeleteTaskFailure = ActionWithPayload<TASK_ACTION_TYPES.DELETE_TASK_FAILED,Error>;

export type AdminTaskListStart = ActionWithPayload<TASK_ACTION_TYPES.ADMIN_TASK_LIST_START,{page?:number,username?:string,startDate?:string,endDate?:string,status?:number}>;
export type AdminTaskListSuccess = ActionWithPayload<TASK_ACTION_TYPES.ADMIN_TASK_LIST_SUCCESS,TaskList>;
export type AdminTaskListFailure = ActionWithPayload<TASK_ACTION_TYPES.ADMIN_TASK_LIST_FAILED,Error>;

export type UserTaskListStart = ActionWithPayload<TASK_ACTION_TYPES.USER_TASK_LIST_START,{page?:number,status?:number}>;
export type UserTaskListSuccess = ActionWithPayload<TASK_ACTION_TYPES.USER_TASK_LIST_SUCCESS,TaskList>;
export type UserTaskListFailure = ActionWithPayload<TASK_ACTION_TYPES.USER_TASK_LIST_FAILED,Error>;

export type UpdateStatusStart = ActionWithPayload<TASK_ACTION_TYPES.UPDATE_STATUS_START,{id:number,status:number}>;
export type UpdateStatusSuccess = ActionWithPayload<TASK_ACTION_TYPES.UPDATE_STATUS_SUCCESS,Tasktype>;
export type UpdateStatusFailure = ActionWithPayload<TASK_ACTION_TYPES.UPDATE_STATUS_FAILED,Error>;

export type ClearErrors = Action<TASK_ACTION_TYPES.CLEAR_ERRORS>;

// functions

export const createTaskStart = withMatcher((data:createTask):CreateTaskStart=> createAction(TASK_ACTION_TYPES.CREATE_TASK_START,data));
export const createTaskSuccess = withMatcher(():CreateTaskSuccess=> createAction(TASK_ACTION_TYPES.CREATE_TASK_SUCCESS));
export const createTaskFailure = withMatcher((error:Error):CreateTaskFailure=> createAction(TASK_ACTION_TYPES.CREATE_TASK_FAILED,error));

export const updateTaskStart = withMatcher((data:Tasktype):UpdateTaskStart=> createAction(TASK_ACTION_TYPES.UPDATE_TASK_START,data));
export const updateTaskSuccess = withMatcher((data:Tasktype):UpdateTaskSuccess=> createAction(TASK_ACTION_TYPES.UPDATE_TASK_SUCCESS,data));
export const updateTaskFailure = withMatcher((error:Error):UpdateTaskFailure=> createAction(TASK_ACTION_TYPES.UPDATE_TASK_FAILED,error));

export const deleteTaskStart = withMatcher((id:number):DeleteTaskStart=> createAction(TASK_ACTION_TYPES.DELETE_TASK_START,id));
export const deleteTaskSuccess = withMatcher(():DeleteTaskSuccess=> createAction(TASK_ACTION_TYPES.DELETE_TASK_SUCCESS));
export const deleteTaskFailure = withMatcher((error:Error):DeleteTaskFailure=> createAction(TASK_ACTION_TYPES.DELETE_TASK_FAILED,error));

export const adminTaskListStart = withMatcher((page?:number,username?:string,startDate?:string,endDate?:string,status?:number):AdminTaskListStart=> createAction(TASK_ACTION_TYPES.ADMIN_TASK_LIST_START,{page,username,startDate,endDate,status}));
export const adminTaskListSuccess = withMatcher((data:TaskList):AdminTaskListSuccess=> createAction(TASK_ACTION_TYPES.ADMIN_TASK_LIST_SUCCESS,data));
export const adminTaskListFailure = withMatcher((error:Error):AdminTaskListFailure=> createAction(TASK_ACTION_TYPES.ADMIN_TASK_LIST_FAILED,error));

export const userTaskListStart = withMatcher((page?:number,status?:number):UserTaskListStart=> createAction(TASK_ACTION_TYPES.USER_TASK_LIST_START,{page,status}));
export const userTaskListSuccess = withMatcher((data:TaskList):UserTaskListSuccess=> createAction(TASK_ACTION_TYPES.USER_TASK_LIST_SUCCESS,data));
export const userTaskListFailure = withMatcher((error:Error):UserTaskListFailure=> createAction(TASK_ACTION_TYPES.USER_TASK_LIST_FAILED,error));

export const updateStatusStart = withMatcher((id:number,status:number):UpdateStatusStart=> createAction(TASK_ACTION_TYPES.UPDATE_STATUS_START,{id,status}));
export const updateStatusSuccess = withMatcher((data:Tasktype):UpdateStatusSuccess=> createAction(TASK_ACTION_TYPES.UPDATE_STATUS_SUCCESS,data));
export const updateStatusFailure = withMatcher((error:Error):UpdateStatusFailure=> createAction(TASK_ACTION_TYPES.UPDATE_STATUS_FAILED,error));

export const clearErrors = withMatcher(():ClearErrors=> createAction(TASK_ACTION_TYPES.CLEAR_ERRORS));