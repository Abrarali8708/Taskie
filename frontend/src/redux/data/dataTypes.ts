export enum DATA_ACTION_TYPES {
    FETCH_COMPANY_START = 'FETCH_COMPANY_START',
    FETCH_COMPANY_SUCCESS = 'FETCH_COMPANY_SUCCESS',
    FETCH_COMPANY_FAILURE = 'FETCH_COMPANY_FAILURE',
    FETCH_USERS_LIST_START = 'FETCH_USERS_LIST_START',
    FETCH_USERS_LIST_SUCCESS = 'FETCH_USERS_LIST_SUCCESS',
    FETCH_USERS_LIST_FAILURE = 'FETCH_USERS_LIST_FAILURE',
    FETCH_ADMIN_DASHBOARD_DATA_START = 'FETCH_ADMIN_DASHBOARD_DATA_START',
    FETCH_ADMIN_DASHBOARD_DATA_SUCCESS = 'FETCH_ADMIN_DASHBOARD_DATA_SUCCESS',
    FETCH_ADMIN_DASHBOARD_DATA_FAILURE = 'FETCH_ADMIN_DASHBOARD_DATA_FAILURE',
    FETCH_USER_DASHBOARD_DATA_START = 'FETCH_USER_DASHBOARD_DATA_START',
    FETCH_USER_DASHBOARD_DATA_SUCCESS = 'FETCH_USER_DASHBOARD_DATA_SUCCESS',
    FETCH_USER_DASHBOARD_DATA_FAILURE = 'FETCH_USER_DASHBOARD_DATA_FAILURE'
}

export type Company = {
    companyName: string;
}

export type User = {
    username: string;
    id: number;
}

export type userDashboardData = {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    pendingTasks: number;
}

export type adminDashboardData =userDashboardData & {
    tasksCompletedToday?: number;
    taskCompletedPerDay?: {
        [key: string]: number
    }
}
