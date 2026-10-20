'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, LoaderCircle } from 'lucide-react';

import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getApiErrorMessage } from '@/lib/api/client';
import {
  PASSWORD_MAX_UTF8_BYTES,
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from '@/lib/password-validation';
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '@/lib/api/auth';

export type AuthAction = 'forgot' | 'reset' | 'change';

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
};

export default function AuthActionForm({
  mode,
  initialToken = '',
  forced = false,
}: {
  mode: AuthAction;
  initialToken?: string;
  forced?: boolean;
}) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(initialToken);
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
    if (mode !== 'forgot') {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }
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
        await resetPassword({ token, newPassword: password });
        setSuccess('Password reset successfully. You can now sign in.');
      } else if (mode === 'change') {
        await changePassword({ currentPassword, newPassword: password });
        setSuccess('Password changed. Your session has ended; sign in again with your new password.');
        clearAuth(true);
        window.setTimeout(() => router.replace('/login?passwordChanged=1'), 1200);
      }
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  const page =
    mode === 'change' && forced
      ? {
          ...config.change,
          title: 'Change your temporary password',
          description:
            'You must update your temporary password before continuing to the dashboard.',
        }
      : config[mode];

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <HeaderContainer loadAccount={false} />
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
            {mode === 'forgot' && (
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
                    minLength={PASSWORD_MIN_LENGTH}
                    maxLength={PASSWORD_MAX_UTF8_BYTES}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <span className="block text-xs font-normal text-muted-foreground">
                    At least 12 characters and no more than 72 UTF-8 bytes.
                  </span>
                </label>
                <label className="block space-y-2 text-sm font-medium">
                  Confirm password
                  <Input required minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_UTF8_BYTES} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
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
