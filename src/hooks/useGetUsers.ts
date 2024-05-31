import { useQuery } from '@tanstack/react-query';

import { User } from '@/types';
import { serverUrl } from '@/lib/constant';

export const useGetUsers = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(serverUrl + '/api/users');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return (await response.json()) as User[];
    }
  });

  return { users: data, isLoading, isError };
};
