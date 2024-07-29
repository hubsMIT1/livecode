// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedState, tokenState } from '../../state/authState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const isAuth = useRecoilValue(tokenState);
  console.log(isAuthenticated,"isAuthenticated protected",)
  const location = useLocation();

  if (!isAuth) {
    // Redirect to login page if not authenticated, passing the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;