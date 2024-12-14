export enum TASK_ACTION_TYPES{
    CREATE_TASK_START = 'CREATE_TASK_START',
    CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS',
    CREATE_TASK_FAILED = 'CREATE_TASK_FAILED',
    UPDATE_TASK_START = 'UPDATE_TASK_START',
    UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS',
    UPDATE_TASK_FAILED = 'UPDATE_TASK_FAILED',
    DELETE_TASK_START = 'DELETE_TASK_START',
    DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS',
    DELETE_TASK_FAILED = 'DELETE_TASK_FAILED',
    ADMIN_TASK_LIST_START = 'ADMIN_TASK_LIST_START',
    ADMIN_TASK_LIST_SUCCESS = 'ADMIN_TASK_LIST_SUCCESS',
    ADMIN_TASK_LIST_FAILED = 'ADMIN_TASK_LIST_FAILED',
    USER_TASK_LIST_START = 'USER_TASK_LIST_START',
    USER_TASK_LIST_SUCCESS = 'USER_TASK_LIST_SUCCESS',
    USER_TASK_LIST_FAILED = 'USER_TASK_LIST_FAILED',
    UPDATE_STATUS_START = 'UPDATE_STATUS_START',
    UPDATE_STATUS_SUCCESS = 'UPDATE_STATUS_SUCCESS',
    UPDATE_STATUS_FAILED = 'UPDATE_STATUS_FAILED',
    CLEAR_ERRORS = 'CLEAR_ERRORS'
}

export type createTask = {
    name:string;
    description:string;
    startDate:string;
    dueDate:string;
    userId:number
}


export type createTaskResponse = {
    message:string;
    data:createTask & {
        adminId:number;
        id:number
    }
}

export type Tasktype = {
    id:number;
    name:string;
    description:string;
    startDate:string;
    dueDate:string;
    completionDate:string | null;
    userId:number;
    adminId:number;
    status:number;
    updatedStatus:string;
    user?:{
        username:string;
    }
}

export type TaskList = {
    tasks:Tasktype[],
    totalSize:number
}