import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ActiveYn, User } from '@/types';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';

interface CreateEditUserProps {
  type: 'create' | 'edit';
  user?: User;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateEditUser = ({ type, user, onOpenChange, open }: CreateEditUserProps) => {
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();

  const [username, setUsername] = useState(user?.username || '');
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [role, setRole] = useState(user?.role || '');
  const [project, setProject] = useState(user?.project || []);
  const [status, setStatus] = useState(user?.activeYn || ActiveYn.Y);

  const handleSubmit = async () => {
    if (type === 'create') {
      await createUser({ username, fullname, activeYn: status, role, project });
    } else {
      await updateUser({ username, fullname, activeYn: status, role, project });
    }

    onOpenChange && onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{type === 'create' ? 'Create user' : 'Edit user'}</DialogTitle>
          <DialogDescription>
            {type === 'create' ? 'Create a new user' : 'Edit an existing user'}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input
              id='username'
              defaultValue={username}
              className='col-span-3'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Full name
            </Label>
            <Input
              id='fullname'
              defaultValue={fullname}
              className='col-span-3'
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Role
            </Label>
            <Select defaultValue={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Developer'>Developer</SelectItem>
                <SelectItem value='Project Manager'>Project Manager</SelectItem>
                <SelectItem value='Tester'>Tester</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Project
            </Label>
            <Input
              id='project'
              defaultValue={project.join(', ')}
              className='col-span-3'
              onChange={(e) => setProject(e.target.value.split(','))}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Status
            </Label>
            <RadioGroup
              defaultValue={status}
              className='col-span-3 grid-cols-2'
              onValueChange={(value) => setStatus(value as ActiveYn)}>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value={ActiveYn.Y} id='r1' />
                <Label htmlFor='r1'>Active</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value={ActiveYn.N} id='r2' />
                <Label htmlFor='r2'>Inactive</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleSubmit}>
            {type === 'create' ? 'Create' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
