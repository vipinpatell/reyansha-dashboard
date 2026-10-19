
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { logout } from '@/lib/api/auth';
import Header from './page';

export default function HeaderContainer() {
  const router = useRouter();
  const [logoutError, setLogoutError] = useState('');

  return (
    <>
      <Header
        user={{
          name: 'Dashboard User',
          image: null,
        }}
        onProfileClick={() => router.push('/profile')}
        onSettingsClick={() => router.push('/change-password')}
        onLogout={async () => {
          setLogoutError('');
          try {
            await logout();
            router.push('/login');
          } catch (error) {
            setLogoutError(
              error instanceof Error ? error.message : 'Unable to sign out.',
            );
          }
        }}
      />
      {logoutError && (
        <p role="alert" className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {logoutError}
        </p>
      )}
    </>
  );
}
