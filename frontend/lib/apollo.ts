import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getUserFromToken } from '@/lib/auth';

// Create an HttpLink for the GraphQL endpoint
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  fetch: async (uri, options) => {
    const response = await fetch(uri, options);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return response;
  },
});

// Dynamically set the authorization header for each request
const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage at the time of the request
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const user = token ? getUserFromToken(token) : null;

  if (token && user) {
    console.log('Request made by:', user?.role);
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;