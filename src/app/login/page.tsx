import { Suspense } from 'react';
import LoginPage from './loginpage';

type LoginRouteProps = {
  searchParams: Promise<{ passwordChanged?: string }>;
};

export default function LoginRoute({ searchParams }: LoginRouteProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p role="status" className="text-sm text-muted-foreground">
            Loading sign-in page...
          </p>
        </main>
      }
    >
      <LoginRouteContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginRouteContent({ searchParams }: LoginRouteProps) {
  const { passwordChanged } = await searchParams;
  return <LoginPage passwordChanged={passwordChanged === '1'} />;
}
