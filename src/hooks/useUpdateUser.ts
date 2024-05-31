import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '@/types';
import { serverUrl } from '@/lib/constant';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await fetch(serverUrl + `/api/users/${data.username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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

  return { updateUser: mutateAsync, isPending, isError };
};
