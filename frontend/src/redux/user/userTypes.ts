export enum USER_ACTION_TYPES{
    EMAIL_SIGN_IN_START='EMAIL_SIGN_IN_START',
    SIGN_IN_SUCCESS='SIGN_IN_SUCCESS',
    SIGN_IN_FAILED='SIGN_IN_FAILED',
    SIGN_UP_START='SIGN_UP_START',
    SIGN_UP_SUCCESS='SIGN_UP_SUCCESS',
    SIGN_UP_FAILED='SIGN_UP_FAILED',
    SIGN_OUT_START='SIGN_OUT_START',
    SIGN_OUT_SUCCESS='SIGN_OUT_SUCCESS',
    SIGN_OUT_FAILED='SIGN_OUT_FAILED'
}

export type UserData={
    readonly id:number;
    readonly username:string;
    readonly isAdmin:boolean;
    readonly token:string;
    readonly companyName:string;
}
