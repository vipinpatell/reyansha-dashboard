import type { User, UserAccountStatus } from '@/types/user';

export function getUserStatusClasses(status?: UserAccountStatus) {
  switch (status) {
    case 'invited':
      return 'bg-sky-500/10 text-sky-700 dark:text-sky-400';
    case 'active':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    case 'suspended':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    case 'deactivated':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getUserFullName(user: User) {
  return `${user.name.firstName ?? ''} ${user.name.lastName ?? ''}`.trim();
}

export function formatUserDate(
  value?: string | null,
  month: 'short' | 'long' = 'short',
) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month,
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatUserDateTime(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });
}
