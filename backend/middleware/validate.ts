import { UserInputError } from 'apollo-server-express';

export const validateUserInput = (input: any) => {
  const { name, email, password } = input;
  if (!name || name.trim().length < 2) {
    throw new UserInputError('Name must be at least 2 characters long');
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new UserInputError('Invalid email format');
  }
  if (!password || password.length < 6) {
    throw new UserInputError('Password must be at least 6 characters long');
  }
};