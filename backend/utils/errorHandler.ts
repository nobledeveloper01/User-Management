import { ApolloError } from 'apollo-server-express';

export const handleError = (error: any) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    return new ApolloError('Duplicate key error', 'DUPLICATE_KEY');
  }
  return new ApolloError(error.message, 'INTERNAL_SERVER_ERROR');
};