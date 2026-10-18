
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const segmentLabels: Record<string, string> = {
  'user-management': 'User Management',
  userlist: 'User List',
  adduser: 'Add User',
  users: 'Users',
  add: 'Add User',
  edit: 'Edit User',
  details: 'User Details',
  roles: 'Role Management',
  settings: 'Settings',
  analytics: 'Analytics',
  shop: 'Shop Management',
  learning: 'Learning Management',
  software: 'Software Services',
  ai: 'AI Solutions',
  ads: 'Advertising',
};

function formatSegment(segment: string, index: number, segments: string[]) {
  if (/^\d+$/.test(segment)) {
    return 'User Details';
  }

  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }

  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="size-4" />
            <span>Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const label = formatSegment(segment, index, segments);

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />

              {isLast ? (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
