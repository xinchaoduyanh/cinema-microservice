"use client";

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass rounded-2xl p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60">Loading...</p>
            </div>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
