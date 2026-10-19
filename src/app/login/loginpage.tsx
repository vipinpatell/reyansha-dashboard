'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { LockKeyhole, Mail, LoaderCircle } from 'lucide-react';

import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to sign in.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <HeaderContainer />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your Reyansha Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 rounded-xl pl-9 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-xl text-sm"
              />
            </div>

            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">
              Forgot your password?
            </Link>
            <Link href="/bootstrap" className="text-muted-foreground hover:text-foreground">
              Set up the first administrator
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}