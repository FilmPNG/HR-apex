import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRoles = [userRole];
  if (userRole === 'superadmin') {
    effectiveRoles.push('admin');
  }

  const isAllowed = allowedRoles.some(role => effectiveRoles.includes(role));

  if (allowedRoles && !isAllowed) {
    // If the user's role is not allowed, redirect them.
    // For example, redirect to a default page or a "not authorized" page.
    if (userRole === 'user') {
      return <Navigate to="/user/news" replace />;
    }
    if (userRole === 'admin' || userRole === 'superadmin') {
      return <Navigate to="/admin/news" replace />;
    }
    // Fallback redirect if role is unknown
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 