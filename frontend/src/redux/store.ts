import {compose,legacy_createStore,applyMiddleware,Middleware,combineReducers} from 'redux';
import {persistStore,persistReducer,PersistConfig} from 'redux-persist';
import logger from 'redux-logger';
import {all,call} from 'typed-redux-saga/macro';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import { userSagas } from './user/userSaga';
import { userReducer } from './user/userReducer';
import createFilter from 'redux-persist-transform-filter';
import { dataReducer } from './data/dataReducer';
import { dataSagas } from './data/dataSaga';
import { taskReducer } from './tasks/taskReducer';
import { taskSagas } from './tasks/taskSagas';


export function* rootSaga(){
    yield* all([call(userSagas),call(dataSagas),call(taskSagas)]);
}

const rootReducer = combineReducers({
    user:userReducer,
    data:dataReducer,
    task:taskReducer
})

export type RootState = ReturnType<typeof rootReducer>;

declare global{
    interface Window{  
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?:typeof compose
    }
}

type extendedPersistConfig=PersistConfig<RootState> & {
    whitelist:(keyof RootState)[]
}

const userFilter = createFilter('user',['currentUser'])
const taskFilter  =createFilter('task',['tasks','totalSize'])

const persistConfig:extendedPersistConfig = {
    key:'root',
    storage,
    whitelist:['user','task'],
    transforms:[userFilter,taskFilter]
}

const sagaMiddleware = createSagaMiddleware();

const middleWares = [process.env.REACT_APP_NODE_ENV ==='development' && logger,sagaMiddleware].filter((middleware):middleware is Middleware=> Boolean(middleware));

const composeEnhancer = (process.env.REACT_APP_NODE_ENV==='development' && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || (compose);
const composedEnhancers = composeEnhancer(applyMiddleware(...middleWares));

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = legacy_createStore(persistedReducer,undefined,composedEnhancers);

sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
