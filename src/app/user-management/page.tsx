
import Link from 'next/link';
import {  Plus, Users } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';

import UsersPage from './users/page';

export default function UsersManagement() {
  return (
    <main className="min-h-screen bg-background p-6 sm:p-8">
      <Breadcrumbs />
      
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage users and their information.
            </p>
          </div>
        </div>

        <Link href="/user-management/add" className={buttonVariants()}>
          <Plus className="mr-2 size-4" />
          Add User
        </Link>
      </div>

      <UsersPage />
    </main>
  );
}
