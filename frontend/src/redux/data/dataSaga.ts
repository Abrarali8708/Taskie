import { all, call,takeLatest,put, select } from "typed-redux-saga";
import { Company, DATA_ACTION_TYPES, User, adminDashboardData } from "./dataTypes";
import { fetchAdminDashboardDataFailure, fetchAdminDashboardDataSuccess, fetchCompanyFailure, fetchCompanySuccess, fetchUserDashboardDataFailure, fetchUserDashboardDataSuccess, fetchUsersListFailure, fetchUsersListSuccess } from "./dataActions";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectUserReducer } from "../user/userSelector";

// CALLING APIS

export function* fetchCompaniesStart(){
    try{
        const response = yield* call(axios.get<Company[]>,`${process.env.REACT_APP_API_URL}/api/data/companyNames`);
        if(response.status===200){
            const data = response.data;
            yield* put(fetchCompanySuccess(data));
        }
    }catch(err){
        yield* put(fetchCompanyFailure(err as Error))
    }
}

export function* fetchUsersListStart(){
    const user = yield* select(selectUserReducer);
    try{
        const response = yield* call(axios.get<User[]>,`${process.env.REACT_APP_API_URL}/api/data/usersList`,{
            headers:{
                Authorization:`Bearer ${user.currentUser?.token}`
            }
        });
        if(response.status===200){
            const data = response.data;
            yield* put(fetchUsersListSuccess(data));
        }
    }catch(err){
        yield* put(fetchUsersListFailure(err as Error))
    }
}

export function* fetchAdminDashboardData(){
    const user = yield* select(selectUserReducer);
    try{
        const response = yield* call(axios.get<adminDashboardData>,`${process.env.REACT_APP_API_URL}/api/task/adminDashboard`,{
            headers:{
                Authorization:`Bearer ${user.currentUser?.token}`
            }
        });
        if(response.status===200){
            const data = response.data;
            yield* put(fetchAdminDashboardDataSuccess(data));
        }
    }catch(err){
        yield* put(fetchAdminDashboardDataFailure(err as Error))
    }
}

export function* fetchUserDashboardData(){
    const user = yield* select(selectUserReducer);
    try{
        const response = yield* call(axios.get<adminDashboardData>,`${process.env.REACT_APP_API_URL}/api/task/userDashboard`,{
            headers:{
                Authorization:`Bearer ${user.currentUser?.token}`
            }
        });
        if(response.status===200){
            const data = response.data;
            yield* put(fetchUserDashboardDataSuccess(data));
        }
    }catch(err){
        yield* put(fetchUserDashboardDataFailure(err as Error))
    }
}

// CALLING SAGAS

export function* onfetchCompanySaga(){
    yield* takeLatest(DATA_ACTION_TYPES.FETCH_COMPANY_START,fetchCompaniesStart);
}

export function* onfetchUsersListSaga(){
    yield* takeLatest(DATA_ACTION_TYPES.FETCH_USERS_LIST_START,fetchUsersListStart);
}

export function* onfetchAdminDashboardData(){
    yield* takeLatest(DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_START,fetchAdminDashboardData);
}

export function* onfetchUserDashboardData(){
    yield* takeLatest(DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_START,fetchUserDashboardData);
}

// ALL SAGAS

export function* dataSagas(){
    yield* all([call(onfetchCompanySaga),call(onfetchUsersListSaga),call(onfetchAdminDashboardData),call(onfetchUserDashboardData)])
}