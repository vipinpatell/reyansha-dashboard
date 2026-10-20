
import {
  Users,
  ShieldCheck,
  Settings,
  BarChart3,
  Code2,
  Megaphone,
  BrainCircuit,
  Activity,
  KeyRound,
  LockKeyhole,
  MailCheck,
} from 'lucide-react';

import ModuleTile from './module-tile';
import { useAuth } from '@/components/auth/auth-provider';
import {
  canManageUsers,
  hasPermission,
} from '@/lib/auth-permissions';

const modules = [
  {
    name: 'User Management',
    description: 'View, create, edit, and manage users.',
    href: '/user-management',
    icon: Users,
  },
  {
    name: 'Role Management',
    description: 'Manage roles and user permissions.',
    href: '/roles',
    icon: ShieldCheck,
  },
  {
    name: 'API Health',
    description: 'Check API availability and connectivity.',
    href: '/health',
    icon: Activity,
  },
  {
    name: 'Change Password',
    description: 'Update the password for your account.',
    href: '/change-password',
    icon: KeyRound,
  },
  {
    name: 'Forgot Password',
    description: 'Request a password reset link by email.',
    href: '/forgot-password',
    icon: MailCheck,
  },
  {
    name: 'Reset Password',
    description: 'Set a new password using your reset token.',
    href: '/reset-password',
    icon: LockKeyhole,
  },
  {
    name: 'Software Services',
    description: 'Manage software projects and services.',
    href: '/software',
    icon: Code2,
  },
  {
    name: 'AI Solutions',
    description: 'Manage AI tools and solutions.',
    href: '/ai',
    icon: BrainCircuit,
  },
  {
    name: 'Advertising',
    description: 'Manage campaigns and marketing services.',
    href: '/ads',
    icon: Megaphone,
  },
  {
    name: 'Analytics',
    description: 'View reports and dashboard insights.',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    description: 'Configure application preferences.',
    href: '/settings',
    icon: Settings,
  },
];

export default function Tiles() {
  const { user } = useAuth();
  const visibleModules = modules.filter((module) => {
    if (module.href === '/user-management') return canManageUsers(user);
    if (module.href === '/roles') return hasPermission(user, 'roles.read');
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleModules.map((module) => (
        <ModuleTile key={module.href} {...module} />
      ))}
    </div>
  );
}
