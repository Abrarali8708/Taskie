import { Action, ActionWithPayload, createAction, withMatcher } from "../../utils/reducer";
import { Company, DATA_ACTION_TYPES, User, adminDashboardData, userDashboardData } from "./dataTypes";


export type FetchCompanyStart = Action<DATA_ACTION_TYPES.FETCH_COMPANY_START>;
export type FetchCompanySuccess = ActionWithPayload<DATA_ACTION_TYPES.FETCH_COMPANY_SUCCESS,Company[]>;
export type FetchCompanyFailure = ActionWithPayload<DATA_ACTION_TYPES.FETCH_COMPANY_FAILURE,Error>;

export type FetchUsersListStart = Action<DATA_ACTION_TYPES.FETCH_USERS_LIST_START>;
export type FetchUsersListSuccess = ActionWithPayload<DATA_ACTION_TYPES.FETCH_USERS_LIST_SUCCESS,User[]>;
export type FetchUsersListFailure = ActionWithPayload<DATA_ACTION_TYPES.FETCH_USERS_LIST_FAILURE,Error>;

export type FetchAdminDashboardDataStart = Action<DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_START>;
export type FetchAdminDashboardDataSuccess = ActionWithPayload<DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_SUCCESS,adminDashboardData>;
export type FetchAdminDashboardDataFailure = ActionWithPayload<DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_FAILURE,Error>;

export type FetchUserDashboardDataStart = Action<DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_START>;
export type FetchUserDashboardDataSuccess = ActionWithPayload<DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_SUCCESS,userDashboardData>;
export type FetchUserDashboardDataFailure = ActionWithPayload<DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_FAILURE,Error>;


// functions

export const fetchCompanyStart = withMatcher(():FetchCompanyStart=> createAction(DATA_ACTION_TYPES.FETCH_COMPANY_START));
export const fetchCompanySuccess = withMatcher((companies:Company[]):FetchCompanySuccess=> createAction(DATA_ACTION_TYPES.FETCH_COMPANY_SUCCESS,companies));
export const fetchCompanyFailure = withMatcher((error:Error):FetchCompanyFailure=> createAction(DATA_ACTION_TYPES.FETCH_COMPANY_FAILURE,error));

export const fetchUsersListStart = withMatcher(():FetchUsersListStart=> createAction(DATA_ACTION_TYPES.FETCH_USERS_LIST_START));
export const fetchUsersListSuccess = withMatcher((usersList:User[]):FetchUsersListSuccess=> createAction(DATA_ACTION_TYPES.FETCH_USERS_LIST_SUCCESS,usersList));
export const fetchUsersListFailure = withMatcher((error:Error):FetchUsersListFailure=> createAction(DATA_ACTION_TYPES.FETCH_USERS_LIST_FAILURE,error));

export const fetchAdminDashboardDataStart = withMatcher(():FetchAdminDashboardDataStart=> createAction(DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_START));
export const fetchAdminDashboardDataSuccess = withMatcher((data:adminDashboardData):FetchAdminDashboardDataSuccess=> createAction(DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_SUCCESS,data));
export const fetchAdminDashboardDataFailure = withMatcher((error:Error):FetchAdminDashboardDataFailure=> createAction(DATA_ACTION_TYPES.FETCH_ADMIN_DASHBOARD_DATA_FAILURE,error));

export const fetchUserDashboardDataStart = withMatcher(():FetchUserDashboardDataStart=> createAction(DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_START));
export const fetchUserDashboardDataSuccess = withMatcher((data:userDashboardData):FetchUserDashboardDataSuccess=> createAction(DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_SUCCESS,data));
export const fetchUserDashboardDataFailure = withMatcher((error:Error):FetchUserDashboardDataFailure=> createAction(DATA_ACTION_TYPES.FETCH_USER_DASHBOARD_DATA_FAILURE,error));
