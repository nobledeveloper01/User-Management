// hooks/useExportUsers.ts
import { useLazyQuery } from '@apollo/client';
import { EXPORT_USERS } from '@/lib/queries';

export const useExportUsers = () => {
  const [exportUsers, { data, loading, error }] = useLazyQuery(EXPORT_USERS);

  return {
    exportUsers,
    users: data?.exportUsers || [],
    loading,
    error
  };
};