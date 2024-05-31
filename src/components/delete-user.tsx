import { useState } from 'react';
import { TrashIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { User } from '@/types';

interface DeleteUserProps {
  user: User;
}

export const DeleteUser = ({ user }: DeleteUserProps) => {
  const [openAlert, setOpenAlert] = useState(false);
  const { deleteUser } = useDeleteUser();

  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-md text-red-500 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 dark:text-red-400 dark:hover:bg-red-400/10 dark:focus-visible:ring-red-400'>
          <TrashIcon className='w-4 h-4' />
          <span className='sr-only'>Delete {user.username}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete {user.username}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteUser(user.username)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
