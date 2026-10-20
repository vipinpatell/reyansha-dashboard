import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { buttonVariants } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <HeaderContainer />
      <main className="flex flex-1 items-center justify-center p-6">
        <section className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto mb-4 size-10 text-destructive" />
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have permission to view this page. Contact an
            administrator if you think you need access.
          </p>
          <Link href="/" className={`${buttonVariants()} mt-6`}>
            Return to dashboard
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
