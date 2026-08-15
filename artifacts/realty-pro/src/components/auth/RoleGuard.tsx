import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/auth/auth.context";
import { hasRole } from "@/auth/permissions";
import { UserRole } from "@/auth/auth.types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const hasAccess = allowedRoles.some((role) => hasRole(role, user.role));
      if (!hasAccess) {
        setLocation("/access-denied");
      }
    }
  }, [user, loading, allowedRoles, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-2xl">⟳</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasAccess = allowedRoles.some((role) => hasRole(role, user.role));

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
