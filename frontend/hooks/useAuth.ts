import { useState, useEffect } from 'react';
import { getUserFromToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = getUserFromToken(token);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        // Invalid token, clear it and redirect to login
        localStorage.removeItem('token');
        router.push('/login');
      }
    } else {
      // No token found, redirect to login
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const isAdmin = user?.role === 'ADMIN';

  return {
    user,
    loading,
    isAdmin,
    role: user?.role || null,
  };
};