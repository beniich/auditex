import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  // BYPASS D'AUTHENTIFICATION : Désactivé temporairement pour visualiser l'interface
  // Cela empêche la page de tourner à vie à cause d'une clé API Clerk manquante.
  return <>{children}</>;
};
