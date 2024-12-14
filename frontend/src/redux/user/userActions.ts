import { Action, ActionWithPayload, createAction, withMatcher } from "../../utils/reducer";
import { USER_ACTION_TYPES, UserData } from "./userTypes";

export type Sign_In_Start = ActionWithPayload<USER_ACTION_TYPES.EMAIL_SIGN_IN_START,{username:string,password:string}>;
export type Sign_In_Success = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_SUCCESS,UserData>;
export type Sign_In_Failed = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_FAILED,Error>;
export type Sign_Up_Start = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_START,{username:string,password:string,isAdmin:boolean,companyName:string}>;
export type SIGN_UP_SUCCESS = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_SUCCESS,UserData>;
export type SIGN_UP_FAILED = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_FAILED,Error>;
export type SIGN_OUT_START = Action<USER_ACTION_TYPES.SIGN_OUT_START>;
export type SIGN_OUT_SUCCESS = Action<USER_ACTION_TYPES.SIGN_OUT_SUCCESS>;
export type SIGN_OUT_FAILED = ActionWithPayload<USER_ACTION_TYPES.SIGN_OUT_FAILED,Error>;


export const SignInStart = withMatcher((username:string,password:string):Sign_In_Start=>createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START,{username,password}));

export const SignInSuccess = withMatcher((user:UserData):Sign_In_Success=>createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS,user));

export const SignInFailed = withMatcher((error:Error):Sign_In_Failed=>createAction(USER_ACTION_TYPES.SIGN_IN_FAILED,error));

export const SignUpStart = withMatcher((username:string,password:string,isAdmin:boolean,companyName:string):Sign_Up_Start=>createAction(USER_ACTION_TYPES.SIGN_UP_START,{username,password,isAdmin,companyName}));

export const SignUpSuccess = withMatcher((user:UserData):SIGN_UP_SUCCESS=>createAction(USER_ACTION_TYPES.SIGN_UP_SUCCESS,user));

export const SignUpFailed = withMatcher((error:Error):SIGN_UP_FAILED=>createAction(USER_ACTION_TYPES.SIGN_UP_FAILED,error));

export const SignOutStart = withMatcher(():SIGN_OUT_START=>createAction(USER_ACTION_TYPES.SIGN_OUT_START));

export const SignOutSuccess = withMatcher(():SIGN_OUT_SUCCESS=>createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS));

export const SignOutFailed = withMatcher((error:Error):SIGN_OUT_FAILED=>createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED,error));