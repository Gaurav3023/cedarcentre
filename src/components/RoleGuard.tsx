"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(user.role)) {
          // Redirect to their own dashboard if they are on the wrong page
          if (user.role === 'student') router.push('/student');
          else if (user.role === 'educator') router.push('/educator');
          else if (user.role === 'admin') router.push('/admin');
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (loading || !user || !roles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-cedar-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-16 animate-pulse" alt="Logo" />
           <p className="text-slate-400 font-serif italic animate-pulse">Securing your journey...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
