import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children, user }: { children: JSX.Element, user: boolean }) => {
  return user ? children : <Navigate to="/login" />;
};



export const LoginPrivateRoute = ({ children, user }: { children: JSX.Element, user: boolean }) => {
  return !user ? children : <Navigate to="/" />;
};
