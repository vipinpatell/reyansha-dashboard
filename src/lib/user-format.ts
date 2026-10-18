import type { User } from '@/types/user';

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
