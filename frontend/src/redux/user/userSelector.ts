import { createSelector } from "reselect";
import { UserState } from "./userReducer";
import { RootState } from "../store";

export const selectUserReducer = (state:RootState):UserState=>state.user;

export const selectCurrentUser = createSelector(
    [selectUserReducer],
    (user)=>user.currentUser
)

export const isUserPresent = createSelector(
    [selectUserReducer],
    (user)=>user.currentUser !== null
)

export const selectisAdmin = createSelector(
    [selectUserReducer],
    (user)=>user.currentUser?.isAdmin ? true : false
)

export const selectLoginError = createSelector(
    [selectUserReducer],
    (user)=>user.error
)