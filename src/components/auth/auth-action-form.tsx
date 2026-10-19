'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, LoaderCircle } from 'lucide-react';

import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  bootstrap,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '@/lib/api/auth';

export type AuthAction = 'forgot' | 'reset' | 'change' | 'bootstrap';

const config: Record<
  AuthAction,
  { title: string; description: string; submit: string }
> = {
  forgot: {
    title: 'Forgot password',
    description: 'Request a password reset link for your account.',
    submit: 'Send reset link',
  },
  reset: {
    title: 'Reset password',
    description: 'Set a new password using your reset token.',
    submit: 'Reset password',
  },
  change: {
    title: 'Change password',
    description: 'Update the password for your signed-in account.',
    submit: 'Change password',
  },
  bootstrap: {
    title: 'Set up administrator',
    description: 'Create the initial administrator account for the API.',
    submit: 'Create administrator',
  },
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to complete the request.';
}

export default function AuthActionForm({
  mode,
  initialToken = '',
}: {
  mode: AuthAction;
  initialToken?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(initialToken);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (mode !== 'forgot' && password !== confirmPassword) {
      setError('The new password and confirmation do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'forgot') {
        await requestPasswordReset(email);
        setSuccess('If the account exists, a password reset link has been sent.');
      } else if (mode === 'reset') {
        await resetPassword({ token, password });
        setSuccess('Password reset successfully. You can now sign in.');
      } else if (mode === 'change') {
        await changePassword({ currentPassword, newPassword: password });
        setSuccess('Password changed successfully.');
      } else {
        await bootstrap({ name, email, password });
        setSuccess('Administrator account created.');
      }
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      if (mode === 'bootstrap') {
        window.setTimeout(() => router.push('/'), 1200);
      }
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  const page = config[mode];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <HeaderContainer />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{page.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{page.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'bootstrap' && (
              <label className="block space-y-2 text-sm font-medium">
                Name
                <Input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
            )}
            {(mode === 'forgot' || mode === 'bootstrap') && (
              <label className="block space-y-2 text-sm font-medium">
                Email address
                <Input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
            )}
            {mode === 'reset' && (
              <label className="block space-y-2 text-sm font-medium">
                Reset token
                <Input required value={token} onChange={(event) => setToken(event.target.value)} />
              </label>
            )}
            {mode === 'change' && (
              <label className="block space-y-2 text-sm font-medium">
                Current password
                <Input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
              </label>
            )}
            {mode !== 'forgot' && (
              <>
                <label className="block space-y-2 text-sm font-medium">
                  {mode === 'change' ? 'New password' : 'Password'}
                  <Input
                    required
                    minLength={8}
                    type="password"
                    autoComplete={mode === 'change' ? 'new-password' : 'new-password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
                <label className="block space-y-2 text-sm font-medium">
                  Confirm password
                  <Input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </label>
              </>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {success && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting && <LoaderCircle className="mr-2 size-4 animate-spin" />}
              {page.submit}
            </Button>
          </form>

          <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
