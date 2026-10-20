'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth/auth-provider';
import { getApiErrorMessage } from '@/lib/api/client';
import Header from './page';

export default function HeaderContainer({
  loadAccount = true,
}: {
  loadAccount?: boolean;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  return (
    <>
      <Header
        user={
          loadAccount && user
            ? {
                name: user.name,
                image: user.profileImage,
                userType: user.userType ?? 'User',
              }
            : { name: 'Account', image: null, userType: 'Not signed in' }
        }
        onProfileClick={() => router.push('/profile')}
        onSettingsClick={() => router.push('/change-password')}
        onLogout={async () => {
          setLogoutError('');
          try {
            await signOut();
          } catch (error) {
            setLogoutError(getApiErrorMessage(error));
          } finally {
            router.push('/login');
          }
        }}
      />
      {logoutError && (
        <p
          role="alert"
          className="border-b bg-destructive/10 px-4 py-2 text-sm text-destructive"
        >
          {logoutError}
        </p>
      )}
    </>
  );
}
