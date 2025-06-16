import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // ถ้า role ไม่ได้สิทธิ์ให้ redirect ตาม role ของ user
    return role === 'employee' ? (
      <Navigate to="/user/news" replace />
    ) : (
      <Navigate to="/admin/news" replace />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
