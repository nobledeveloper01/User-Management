import jwt from 'jsonwebtoken';

interface User {
  id: string;
  role: string;
}

// lib/auth.ts
export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === 'string') {
      console.error('Invalid token format');
      return null;
    }
    
    // Normalize role to uppercase
    const user = decoded as User;
    if (user.role) {
      user.role = user.role.toUpperCase();
    }
    
    return user;
  } catch (err) {
    console.error('Token decode failed:', err);
    return null;
  }
};