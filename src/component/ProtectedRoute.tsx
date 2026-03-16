import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // On vérifie la présence du token
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Outlet permet de rendre les composants enfants définis dans le Router
  return <Outlet />;
};

export default ProtectedRoute;