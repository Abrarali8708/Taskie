import { takeLatest, call, put, all, delay } from 'typed-redux-saga/macro';
import { USER_ACTION_TYPES, UserData } from './userTypes';
import { SignInStart, SignUpStart, SignUpSuccess, SignInFailed, SignInSuccess, SignOutFailed, SignOutStart, SIGN_OUT_SUCCESS, SignUpFailed, SIGN_UP_SUCCESS, Sign_In_Start, Sign_Up_Start, SignOutSuccess } from './userActions';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface LoginResponse {
    message: string,
    user: {
        id: number;
        username: string;
        isAdmin: boolean;
        companyName: string;
        token: string;
    }
}


export function* signInStart({ payload: { username, password } }: Sign_In_Start) {
    try {
        const response = yield* call(axios.post<LoginResponse>, `${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
        if (response.status === 200) {
            const {user} = response.data;
            toast.success('Login Successful');
            yield* put(SignInSuccess({ ...user }));
            yield* call(setupTokenExpiryWatcher, user.token);
        }
    } catch (err) {
        yield* put(SignInFailed((err as AxiosError).response?.data as Error));
        toast.error('Something went wrong');
    }
}

function* setupTokenExpiryWatcher(token: String) {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const delayTime = (exp - currentTime) * 1000;

    if (delayTime > 0) {
        yield delay(delayTime);
        yield call(signOut);
    } else {
        yield call(signOut);
    }
}

export function* signUpStart({ payload: { username,password,isAdmin,companyName } }: Sign_Up_Start) {
    try {
        const response = yield* call(axios.post<LoginResponse>, `${process.env.REACT_APP_API_URL}/api/auth/register`, {username, password,isAdmin,companyName });
        if (response.status === 201) {
            const { user } = response.data;
            yield* put(SignUpSuccess({ ...user }))
            toast.success('Signup Successful');
            yield* call(setupTokenExpiryWatcher, user.token);
        }
    } catch (err) {
        yield* put(SignUpFailed(err as Error));
        toast.error('Something went wrong');
    }
}

export function* signInAfterSignUp({ payload: user }: SIGN_UP_SUCCESS) {
    yield* put(SignUpSuccess({ ...user }))
}

export function* signOut() {
    try {
        yield* put(SignOutSuccess());
        toast.success('Logout Successful');
    } catch (err) {
        yield* put(SignOutFailed(err as Error));
        toast.error('Something went wrong');
    }
}

export function* onEmailSignInStart() {
    yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInStart);
}

export function* onSignUpStart() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUpStart)
}

export function* onSignUpSuccess() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* userSagas() {
    yield* all([call(onEmailSignInStart), call(onSignUpStart), call(onSignOutStart)]);
}