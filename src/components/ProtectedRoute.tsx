import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const ensureSession = useAuthStore((state) => state.ensureSession);
  const refreshSession = useAuthStore((state) => state.refreshSession);

  useEffect(() => {
    if (!isAuthenticated) return;
    const valid = ensureSession();
    if (valid) {
      refreshSession();
    }
  }, [ensureSession, isAuthenticated, refreshSession]);

  if (!isAuthenticated || sessionExpired) {
    return <Navigate to="/admin/login" replace state={{ reason: 'expired' }} />;
  }

  return <>{children}</>;
}
