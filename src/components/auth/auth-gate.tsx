'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

import { useAuth } from './auth-provider';
import {
  hasRoutePermission,
  publicRoutes,
  requiresForcedPasswordChange,
} from '@/lib/auth-authorization';
import { Button } from '@/components/ui/button';

function LoadingScreen({ message }: { message: string }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <p role="status" className="flex items-center gap-3 text-sm text-muted-foreground">
        <RefreshCw className="size-4 animate-spin" />
        {message}
      </p>
    </main>
  );
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, error, passwordChanged, refreshUser } = useAuth();
  const isPublic = publicRoutes.has(pathname);
  const forbidden = !isPublic && user && !hasRoutePermission(pathname, user);
  const mustChangePassword = requiresForcedPasswordChange(user, pathname);

  useEffect(() => {
    if (loading) return;
    if (pathname === '/login' && user) {
      router.replace(
        user.mustChangePassword ? '/change-password?forced=1' : '/dashboard',
      );
      return;
    }
    if (isPublic) return;
    if (!user) {
      router.replace(passwordChanged ? '/login?passwordChanged=1' : '/login');
      return;
    }
    if (mustChangePassword) {
      router.replace('/change-password?forced=1');
      return;
    }
    if (forbidden) router.replace('/forbidden');
  }, [
    forbidden,
    isPublic,
    loading,
    mustChangePassword,
    passwordChanged,
    pathname,
    router,
    user,
  ]);

  if (isPublic) return children;
  if (loading) return <LoadingScreen message="Checking your session..." />;
  if (error && !user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">Unable to verify your session</h1>
        <p role="alert" className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => void refreshUser().catch(() => undefined)}>
          Try again
        </Button>
      </main>
    );
  }
  if (!user || forbidden || mustChangePassword) {
    return <LoadingScreen message="Redirecting..." />;
  }

  if (user.mustChangePassword && pathname === '/change-password') {
    return children;
  }

  return children;
}
