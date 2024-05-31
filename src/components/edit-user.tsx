import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { CreateEditUser } from './create-edit-user-modal';
import { Button } from './ui/button';
import { User } from '@/types';

interface EditUserProps {
  user: User;
}

export const EditUser = ({ user }: EditUserProps) => {
  const [openEditUser, setOpenEditUser] = useState(false);

  return (
    <>
      <Button variant='secondary' type='button' onClick={() => setOpenEditUser(true)}>
        <EditIcon className='w-4 h-4' />
        <span className='sr-only'>Edit {user.username}</span>
      </Button>
      <CreateEditUser type='edit' user={user} open={openEditUser} onOpenChange={setOpenEditUser} />
    </>
  );
};
