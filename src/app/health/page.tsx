'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { Button } from '@/components/ui/button';
import { getHealth } from '@/lib/api/health';
import { getApiErrorMessage } from '@/lib/api/client';

export default function HealthPage() {
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setResult(await getHealth());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getHealth()
      .then((health) => {
        if (active) setResult(health);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderContainer />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 sm:p-8">
        <Breadcrumbs />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Activity className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">API Health</h1>
              <p className="text-sm text-muted-foreground">
                Check connectivity to the Reyansha API.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => void checkHealth()} disabled={loading}>
            <RefreshCw className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} />
            Check again
          </Button>
        </div>

        <section className="rounded-xl border bg-card p-6">
          {loading ? (
            <p role="status" className="text-sm text-muted-foreground">Checking API status...</p>
          ) : error ? (
            <div role="alert">
              <p className="font-semibold text-destructive">API unavailable</p>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <>
              <p role="status" className="font-semibold text-emerald-700 dark:text-emerald-400">
                API responded successfully
              </p>
              <pre className="mt-4 overflow-auto rounded-lg bg-muted p-4 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
