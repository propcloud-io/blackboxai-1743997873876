import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useRoles from '../../hooks/useRoles';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();
  const { hasAnyRole } = useRoles();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !hasAnyRole(...roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
