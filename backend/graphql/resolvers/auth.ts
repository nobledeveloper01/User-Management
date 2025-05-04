import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { UserInputError } from 'apollo-server-express';

export const authResolvers = {
  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) throw new UserInputError('Invalid credentials');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new UserInputError('Invalid credentials');
      const token = jwt.sign(
        { 
          id: user._id, 
          role: user.role.toUpperCase() // Ensure consistent case
        }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '1h' }
      );
      return { token, user };
    },
    signup: async (_: any, { input }: { input: any }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) throw new UserInputError('Email already exists');
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = new User({ 
        ...input, 
        password: hashedPassword, 
        role: 'USER', // Changed to uppercase to match enum
        status: 'ACTIVE' // Added default status
      });
      await user.save();
    
      return { user };
    },
  },
};