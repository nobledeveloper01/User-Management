import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { getUserFromToken } from '@/lib/auth'; // Adjust the import path as necessary

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    headers: {
      authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
    },
    fetch: async (uri, options) => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = getUserFromToken(token);
        console.log('Request made by:', user?.role);
      }
      
      const response = await fetch(uri, options);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return response;
    },
  }),
  cache: new InMemoryCache(),
});

export default client;