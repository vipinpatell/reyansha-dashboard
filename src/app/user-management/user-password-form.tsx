'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { KeyRound, LoaderCircle } from 'lucide-react';

import { useAuth } from '@/components/auth/auth-provider';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { canSetUserPassword } from '@/lib/auth-permissions';
import { getApiErrorMessage } from '@/lib/api/client';
import { setUserPassword } from '@/lib/api/users';
import {
  PASSWORD_MAX_UTF8_BYTES,
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from '@/lib/password-validation';

export default function UserPasswordForm({ userId }: { userId: string }) {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const authorized = canSetUserPassword(user);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!authorized) {
      setError('Only a Super Admin with roles.manage can set another user’s password.');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError('The password and confirmation do not match.');
      return;
    }
    if (!window.confirm('Set this temporary password? The user will need to change it at their next sign-in.')) {
      return;
    }

    setSaving(true);
    try {
      await setUserPassword(userId, password);
      setPassword('');
      setConfirmPassword('');
      setSuccess(
        'Temporary password set. The user must change it at their next sign-in; their existing sessions and outstanding reset/invitation links have been revoked.',
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <Breadcrumbs />
        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Set temporary password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                User ID: <code>{userId}</code>
              </p>
            </div>
          </div>

          <p className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            The API will hash the new password, end the user’s existing sessions,
            invalidate outstanding reset/invitation links, and require a password
            change at their next sign-in. The password is never displayed after
            submission.
          </p>

          {!authorized ? (
            <p role="alert" className="text-sm text-destructive">
              Only a Super Admin with the <code>roles.manage</code> permission can
              set another user’s password.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-2 text-sm font-medium">
                Temporary password
                <Input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <span className="block text-xs font-normal text-muted-foreground">
                  At least 12 characters and no more than 72 UTF-8 bytes.
                </span>
              </label>
              <label className="block space-y-2 text-sm font-medium">
                Confirm temporary password
                <Input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_UTF8_BYTES}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              {success && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                  Set temporary password
                </Button>
                <Link href="/user-management" className={buttonVariants({ variant: 'outline' })}>
                  Back to users
                </Link>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
