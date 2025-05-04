import { useState, useEffect } from 'react';
import { getUserFromToken } from '@/lib/auth';

interface User {
  id: string;
  role: string;
}

// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = getUserFromToken(token);
      if (decodedUser) {
        console.log('Authenticated user:', {
          id: decodedUser.id,
          role: decodedUser.role,
          isAdmin: decodedUser.role === 'ADMIN'
        });
        setUser(decodedUser);
      }
    }
    setLoading(false);
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  
  return { 
    user, 
    loading,
    isAdmin,
    role: user?.role || null
  };
};