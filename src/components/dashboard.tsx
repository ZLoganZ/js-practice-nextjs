import { useState, useMemo } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import Head from 'next/head';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './toggleTheme';
import { ActiveYn, User } from '@/types';
import { useGetUsers } from '@/hooks/useGetUsers';
import { CreateEditUser } from './create-edit-user-modal';
import { EditUser } from './edit-user';
import { DeleteUser } from './delete-user';

export function Dashboard() {
  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor('username', {
      header: 'User name',
      cell: (info) => <p className='font-medium'>{info.getValue()}</p>
    }),
    columnHelper.accessor('fullname', {
      header: 'Full name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => <Badge variant='outline'>{info.getValue()}</Badge>
    }),
    columnHelper.accessor('project', {
      header: 'Project',
      cell: (info) => info.getValue().join(', ')
    }),
    columnHelper.accessor('activeYn', {
      header: 'Status',
      cell: (info) => (
        <Badge
          variant={
            info.getValue() === ActiveYn.Y
              ? 'default'
              : info.getValue() === ActiveYn.N
              ? 'destructive'
              : 'secondary'
          }>
          {info.getValue()}
        </Badge>
      )
    })
  ];

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    role: 'all',
    activeYn: 'all'
  });
  const [openCreateUser, setOpenCreateUser] = useState(false);

  const { users } = useGetUsers();

  const data = useMemo(
    () =>
      (users || [])
        .filter((user) => {
          const searchValue = search.toLowerCase();
          return (
            user.fullname.toLowerCase().includes(searchValue) ||
            user.username.toLowerCase().includes(searchValue) ||
            user.role.toLowerCase().includes(searchValue) ||
            user.project.some((project) => project.toLowerCase().includes(searchValue))
          );
        })
        .filter((user) => {
          if (filter.role === 'all' && filter.activeYn === 'all') {
            return true;
          } else if (filter.role === 'all') {
            return user.activeYn.toLowerCase() === filter.activeYn;
          } else if (filter.activeYn === 'all') {
            return user.role.toLowerCase() === filter.role;
          } else {
            return user.role.toLowerCase() === filter.role && user.activeYn.toLowerCase() === filter.activeYn;
          }
        }),
    [search, filter, users]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12'>
      <Head>
        <title>User Management</title>
      </Head>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>User Management</h1>
        <div className='flex items-center justify-center gap-2 md:gap-4'>
          <ThemeToggle />
          <Button variant='outline' onClick={() => setOpenCreateUser(true)} type='button'>
            <PlusIcon className='w-4 h-4 mr-2' />
            Add User
          </Button>
          <CreateEditUser type='create' open={openCreateUser} onOpenChange={setOpenCreateUser} />
        </div>
      </div>
      <div className='mb-6 grid gap-4 md:grid-cols-2'>
        <div className='flex relative items-center gap-2'>
          <SearchIcon className='w-4 h-4 absolute ml-3 text-gray-500 dark:text-gray-400' />
          <Input
            type='search'
            placeholder='Search users...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-8'
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Select
            value={filter.role}
            onValueChange={(value) => setFilter((prev) => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='developer'>Developer</SelectItem>
              <SelectItem value='project manager'>Project Manager</SelectItem>
              <SelectItem value='tester'>Tester</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filter.activeYn}
            onValueChange={(value) => setFilter((prev) => ({ ...prev, activeYn: value }))}>
            <SelectTrigger>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='y'>Active</SelectItem>
              <SelectItem value='n'>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })
              )}
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <EditUser user={row.original} />
                    <DeleteUser user={row.original} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
