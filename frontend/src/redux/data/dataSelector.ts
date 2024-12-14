import { createSelector } from "reselect";
import { DataState } from "./dataReducer";
import { RootState } from "../store";

export const selectDataReducer = (state:RootState):DataState=>state.data;

export const selectCompanyNames = createSelector(
    [selectDataReducer],
    (data)=>data.companies
)

export const selectUsernames = createSelector(
    [selectDataReducer],
    (data)=>data.usersList
)

export const selectAdminDashboardData = createSelector(
    [selectDataReducer],
    (data)=>data.adminDashboardData
)

export const selectUserDashboardData = createSelector(
    [selectDataReducer],
    (data)=>data.userDashboardData
)

export const selectDashboardData = (isAdmin: boolean) => createSelector(
    [selectDataReducer],
    (data) => isAdmin ? data.adminDashboardData : data.userDashboardData
)