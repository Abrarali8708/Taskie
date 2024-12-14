import { SignInFailed, SignInSuccess, SignOutFailed, SignOutSuccess, SignUpFailed, SignUpSuccess } from "./userActions";
import { UserData } from "./userTypes";
import { AnyAction } from "redux-saga";

export type UserState={
    readonly currentUser : UserData | null,
    readonly isLoading:boolean,
    readonly error:Error | null
}

export const INITIAL_STATE : UserState = {
    currentUser:null,
    isLoading:false,
    error:null
};

export const userReducer = (state = INITIAL_STATE,action:AnyAction):UserState=>{
    if(SignInSuccess.match(action) || SignUpSuccess.match(action)){
        return {...state,currentUser:action.payload,isLoading:false,error:null};
    }

    if(SignInFailed.match(action) || SignUpFailed.match(action) || SignOutFailed.match(action)){
        return {...state,isLoading:false,error:action.payload};
    }

    if(SignOutSuccess.match(action)){
        return {...state,isLoading:false,currentUser:null,error:null};
    }

    return state
}