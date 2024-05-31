import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '@/types';
import { serverUrl } from '@/lib/constant';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (username: string) => {
      const response = await fetch(serverUrl + `/api/users/${username}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return (await response.json()) as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return { deleteUser: mutateAsync, isPending, isError };
};
