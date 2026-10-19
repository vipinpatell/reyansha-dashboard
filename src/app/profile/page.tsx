'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, UserRound } from 'lucide-react';

import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { Button } from '@/components/ui/button';
import { getCurrentUser, refreshSession } from '@/lib/api/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load the signed-in account.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    setError('');
    setNotice('');
    try {
      await refreshSession();
      setUser(await getCurrentUser());
      setNotice('Session refreshed.');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to refresh the session.',
      );
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
            <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
