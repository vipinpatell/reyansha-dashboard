
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCurrentUser, logout } from '@/lib/api/auth';
import { isRecord } from '@/lib/api/client';
import Header from './page';

interface HeaderUser {
  name: string;
  image: string | null;
  userType: string;
}

const guestUser: HeaderUser = {
  name: 'Account',
  image: null,
  userType: 'Not signed in',
};

function getString(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (typeof record[key] === 'string' && record[key].trim()) {
      return record[key].trim();
    }
  }

  return '';
}

function parseHeaderUser(response: unknown): HeaderUser {
  const profile =
    isRecord(response) && isRecord(response.user)
      ? response.user
      : isRecord(response) && isRecord(response.profile)
        ? response.profile
        : isRecord(response) && isRecord(response.account)
          ? response.account
          : response;

  if (!isRecord(profile)) {
    throw new Error('The current-user response did not contain an account.');
  }

  const nameRecord = isRecord(profile.name) ? profile.name : undefined;
  const name =
    getString(profile, 'fullName', 'displayName') ||
    (nameRecord
      ? [
          getString(nameRecord, 'firstName', 'first_name', 'first'),
          getString(nameRecord, 'lastName', 'last_name', 'last'),
        ]
          .filter(Boolean)
          .join(' ')
      : getString(profile, 'name')) ||
    getString(profile, 'username', 'email') ||
    'Account';
  const image =
    getString(profile, 'profileImage', 'profile_image', 'avatarUrl', 'avatar', 'image') ||
    null;

  return {
    name,
    image,
    userType: getString(profile, 'userType', 'user_type', 'type') || 'User',
  };
}

export default function HeaderContainer({
  loadAccount = true,
}: {
  loadAccount?: boolean;
}) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<HeaderUser>(guestUser);
  const [logoutError, setLogoutError] = useState('');

  useEffect(() => {
    if (!loadAccount) return;

    let active = true;
    getCurrentUser()
      .then((response) => {
        if (active) {
          setCurrentUser(parseHeaderUser(response));
          setLogoutError('');
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setCurrentUser(guestUser);
          setLogoutError(
            error instanceof Error
              ? `Unable to load the signed-in account: ${error.message}`
              : 'Unable to load the signed-in account.',
          );
        }
      });

    return () => {
      active = false;
    };
  }, [loadAccount]);

  return (
    <>
      <Header
        user={loadAccount ? currentUser : guestUser}
        onProfileClick={() => router.push('/profile')}
        onSettingsClick={() => router.push('/change-password')}
        onLogout={async () => {
          setLogoutError('');
          try {
            await logout();
            setCurrentUser(guestUser);
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
