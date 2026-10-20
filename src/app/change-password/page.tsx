import { Suspense } from 'react';
import AuthActionForm from '@/components/auth/auth-action-form';

type ChangePasswordPageProps = {
  searchParams: Promise<{ forced?: string }>;
};

export default function ChangePasswordPage({
  searchParams,
}: ChangePasswordPageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p role="status" className="text-sm text-muted-foreground">
            Loading password form...
          </p>
        </main>
      }
    >
      <ChangePasswordContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ChangePasswordContent({
  searchParams,
}: ChangePasswordPageProps) {
  const { forced } = await searchParams;
  return <AuthActionForm mode="change" forced={forced === '1'} />;
}
