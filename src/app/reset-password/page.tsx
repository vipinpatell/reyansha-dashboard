import { Suspense } from 'react';
import AuthActionForm from '@/components/auth/auth-action-form';

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p role="status" className="text-sm text-muted-foreground">
            Loading password reset form...
          </p>
        </main>
      }
    >
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordContent({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;
  return (
    <AuthActionForm
      mode="reset"
      initialToken={Array.isArray(token) ? token[0] ?? '' : token ?? ''}
    />
  );
}
