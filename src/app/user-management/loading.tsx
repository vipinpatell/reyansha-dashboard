import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main
      aria-label="Loading user management"
      aria-busy="true"
      className="min-h-screen bg-background p-6 sm:p-8"
    >
      <Skeleton className="mb-6 h-5 w-40" />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <Skeleton className="h-48 w-full rounded-xl" />
    </main>
  );
}
