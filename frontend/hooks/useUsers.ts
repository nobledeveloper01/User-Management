import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/lib/queries';
import { UserConnection } from '@/types';

// In your useUsers hook
export const useUsers = (
  page: number,
  limit: number,
  search: string,
  role?: string,
  status?: string
) => {
  const { data, loading, error } = useQuery<{ users: UserConnection }>(GET_USERS, {
    variables: { 
      page, 
      limit, 
      search,
      role: role && role !== 'All' ? role : undefined,
      status: status && status !== 'All' ? status : undefined
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: (err) => {
      console.error('GetUsers query failed:', err);
      if (err.message.includes('Unauthorized')) {
        console.warn('Unauthorized access to users query. Please log in with appropriate credentials.');
      }
    },
  });

  return { 
    data,
    loading,
    error,
    users: data?.users?.users || [],
    totalPages: data?.users?.totalPages || 1,
    totalCount: data?.users?.totalCount || 0
  };
};