"use client";

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requireAdmin = true, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && isAuthenticated && requireAdmin && !isAdmin) {
      // User is authenticated but not an admin
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-white/60">Loading...</p>
            </div>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
