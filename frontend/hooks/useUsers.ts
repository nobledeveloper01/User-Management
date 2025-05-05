import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/lib/queries';
import { UserConnection } from '@/types';
import { showToast } from '@/components/ShowToast';

export const useUsers = (
  page: number,
  limit: number,
  search: string,
  role?: string,
  status?: string,
  skip: boolean = false // Add skip parameter with default value of false
) => {
  const { data, loading, error } = useQuery<{ users: UserConnection }>(GET_USERS, {
    variables: {
      page,
      limit,
      search,
      role: role && role !== 'All' ? role : undefined,
      status: status && status !== 'All' ? status : undefined,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip, // Skip the query if skip is true
    onError: (err) => {
      if (err.message.includes('Unauthorized')) {
        showToast('Unauthorized access to users query. Please log in with appropriate credentials.', "error");
      }
    },
  });

  return {
    data,
    loading,
    error,
    users: data?.users?.users || [],
    totalPages: data?.users?.totalPages || 1,
    totalCount: data?.users?.totalCount || 0,
  };
};