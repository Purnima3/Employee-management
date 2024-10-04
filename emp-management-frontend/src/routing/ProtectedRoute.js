// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useUser(); 
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />; 
  }

  return children;
};

export default ProtectedRoute;
