import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

export const authMiddleware = (context: any) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new AuthenticationError('Authorization header missing');

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};