import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';

/**
 * A protected route component that checks for authentication and user roles.
 * @param {object} props
 * @param {string[]} props.allowedRoles - An array of roles allowed to access the route.
 * e.g., ['freelancer', 'empresa']
 */
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, tipo_usuario, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to a "not authenticated" page or login
    return <Navigate to="/notauthenticated" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(tipo_usuario)) {
    // If the user's role is not allowed, redirect to an "unauthorized" page
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and role is allowed, render the child routes
  return <Outlet />;
}

export default ProtectedRoute;