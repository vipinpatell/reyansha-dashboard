
import {
  Users,
  ShieldCheck,
  Settings,
  ShoppingCart,
  GraduationCap,
  BarChart3,
  Code2,
  Megaphone,
  BrainCircuit,
} from 'lucide-react';

import ModuleTile from './module-tile';

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
    name: 'Learning Management',
    description: 'Manage courses and learning content.',
    href: '/learning',
    icon: GraduationCap,
  },
  {
    name: 'Shop Management',
    description: 'Manage products and orders.',
    href: '/shop',
    icon: ShoppingCart,
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
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {modules.map((module) => (
        <ModuleTile key={module.href} {...module} />
      ))}
    </div>
  );
}
