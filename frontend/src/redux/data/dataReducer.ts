import { AnyAction } from "redux-saga"
import { Company, User, adminDashboardData, userDashboardData } from "./dataTypes"
import { fetchAdminDashboardDataFailure, fetchAdminDashboardDataSuccess, fetchCompanyFailure, fetchCompanySuccess, fetchUserDashboardDataFailure, fetchUserDashboardDataSuccess, fetchUsersListFailure, fetchUsersListSuccess } from "./dataActions"


export type DataState = {
    companies:Company[],
    usersList:User[],
    adminDashboardData:adminDashboardData,
    userDashboardData:userDashboardData,
    isLoading:boolean,
    error:Error | null
}

export const INITIAL_STATE ={
    companies:[],
    usersList:[],
    adminDashboardData:{
        totalTasks:0,
        completedTasks:0,
        overdueTasks:0,
        pendingTasks:0
    },
    userDashboardData:{
        totalTasks:0,
        completedTasks:0,
        overdueTasks:0,
        pendingTasks:0
    },
    isLoading:false,
    error:null
}

export const dataReducer = (state:DataState = INITIAL_STATE,action:AnyAction):DataState => {
    if(fetchCompanySuccess.match(action)){
        return {...state,companies:action.payload,isLoading:false,error:null}
    }

    if(fetchUsersListSuccess.match(action)){
        return {...state,usersList:action.payload,isLoading:false,error:null}
    }

    if(fetchCompanyFailure.match(action) || fetchUsersListFailure.match(action)){
        return {...state,isLoading:false,error:action.payload}
    }
    if(fetchAdminDashboardDataSuccess.match(action)){
        return {...state,adminDashboardData:action.payload,isLoading:false,error:null}
    }

    if(fetchUserDashboardDataSuccess.match(action)){
        return {...state,userDashboardData:action.payload,isLoading:false,error:null}
    }

    if(fetchAdminDashboardDataFailure.match(action) || fetchUserDashboardDataFailure.match(action)){
        return {...state,isLoading:false,error:action.payload}
    }   

    return state;
}