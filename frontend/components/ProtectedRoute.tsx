'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    if (!loading && !user && !['/login', '/signup'].includes(window.location.pathname)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center p-6 text-gray-600 dark:text-gray-300 items-center justify-center"><LoadingSpinner size='lg'/></div>;
  }

  return <>{children}</>;
}