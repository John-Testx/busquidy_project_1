import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks';
import LoadingScreen from '@/components/LoadingScreen';

/**
 * Rutas protegidas con control de verificación
 * @param {string[]} allowedRoles - Roles permitidos para acceder
 */
function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Lista de rutas permitidas para usuarios no verificados
  const allowedPathsForUnverified = [
    '/verificar-documentos',
    '/soporte',
    '/configuracion',
    '/notifications',
    '/chat',
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/notauthenticated" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // LÓGICA DE BLOQUEO POR VERIFICACIÓN
  if (user.estado_verificacion !== 'verificado') {
    const currentPath = location.pathname;
    
    // Verificar si la ruta actual está en la lista de permitidas
    const isAllowedPath = allowedPathsForUnverified.some(path => 
      currentPath.startsWith(path)
    );

    if (!isAllowedPath) {
      // Redirigir a página de verificación
      return <Navigate to="/verificar-documentos" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;