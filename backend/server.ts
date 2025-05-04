import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { connectMongoDB } from './confiq/db';
import { userResolvers } from './graphql/resolvers/user';
import { authResolvers } from './graphql/resolvers/auth';
import userSchema from './graphql/schemas/user';
import authSchema from './graphql/schemas/auth';
import { seedAdmin, seedUsers } from './seed';

dotenv.config();

const app = express();

// Define allowed origins (you can add more if needed)
const allowedOrigins = [
  'http://localhost:3000',
  'https://user-management-five-iota.vercel.app',
];

// Setup CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Connect to MongoDB and seed data
connectMongoDB();
seedAdmin();
seedUsers();

// Create Apollo Server
const server = new ApolloServer({
  typeDefs: [userSchema, authSchema],
  resolvers: [userResolvers, authResolvers],
  context: ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return {};

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
      return { user: decoded };
    } catch (err) {
      console.error('JWT verification failed:', err);
      return {};
    }
  },
});

// Start server function
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, cors: false }); // Disable Apollo CORS so Express CORS applies

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
