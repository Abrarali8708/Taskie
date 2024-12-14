import React, { Suspense, lazy } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/navigation/Navigation';
import { LoginPrivateRoute, PrivateRoute } from './components/privateRoute/PrivateRoute';
import { useSelector } from 'react-redux';
import { isUserPresent, selectisAdmin } from './redux/user/userSelector';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const Home = lazy(() => import('./routes/home/Home'));
const TaskList = lazy(() => import('./routes/taskList/TaskList'));
const TaskDetail = lazy(() => import('./components/taskDetail/TaskDetail'));
const CreateTask = lazy(() => import('./routes/createTask/CreateTask'));
const Login = lazy(() => import('./routes/login/Login'));
const Register = lazy(() => import('./routes/register/Register'));
const PageNotFound = lazy(() => import('./routes/pageNotFound/PageNotFound'));

function App() {
  const user = useSelector(isUserPresent)
  const isAdmin = useSelector(selectisAdmin);
  return (
    <Suspense>
      <div className='App'>
        <ToastContainer position='bottom-right' />
        <Routes>
          <Route path='/' element={<Navigation />}>
            <Route index element={<PrivateRoute user={user}><Home /></PrivateRoute>} />
            <Route path='/taskList' element={<PrivateRoute user={user}><TaskList /></PrivateRoute>} />
            <Route path='/taskDetail/:id' element={<PrivateRoute user={user}><TaskDetail /></PrivateRoute>} />
            {
              isAdmin && (
                <Route path='/createTask' element={<PrivateRoute user={user}><CreateTask /></PrivateRoute>} />
              )
            }
          </Route>
          <Route path='/login' element={<LoginPrivateRoute user={user}><Login /></LoginPrivateRoute>} />
          <Route path='/register' element={<LoginPrivateRoute user={user}><Register /></LoginPrivateRoute>} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
