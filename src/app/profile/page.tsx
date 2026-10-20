'use client';

import { useState } from 'react';
import { RefreshCw, UserRound } from 'lucide-react';

import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { Button } from '@/components/ui/button';
import { refreshSession } from '@/lib/api/auth';
import { useAuth } from '@/components/auth/auth-provider';
import { getApiErrorMessage } from '@/lib/api/client';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleRefresh() {
    setRefreshing(true);
    setError('');
    setNotice('');
    try {
      await refreshSession();
      await refreshUser();
      setNotice('Session refreshed.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderContainer />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 sm:p-8">
        <Breadcrumbs />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My account</h1>
              <p className="text-sm text-muted-foreground">Your authenticated account details.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => void handleRefresh()} disabled={refreshing || loading}>
            <RefreshCw className={`mr-2 size-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh session
          </Button>
        </div>
        {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="mb-4 text-sm text-emerald-700 dark:text-emerald-400">{notice}</p>}
        <section className="rounded-xl border bg-card p-6">
          {loading ? (
            <p role="status" className="text-sm text-muted-foreground">Loading account...</p>
          ) : user === null ? (
            <p className="text-sm text-muted-foreground">No account data is available.</p>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              <ProfileField label="Name" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Username" value={user.username} />
              <ProfileField label="User type" value={user.userType} />
              <ProfileField
                label="Roles"
                value={user.roles.map((role) => role.name || role.key).filter(Boolean).join(', ')}
              />
              <ProfileField
                label="Permissions"
                value={user.permissions.join(', ')}
              />
            </dl>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium">{value || '—'}</dd>
    </div>
  );
}
