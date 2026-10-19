
'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu,
  Sun,
  Moon,
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  user?: {
    name: string;
    image?: string | null;
    userType?: string;
  };
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

const subscribeToMount = () => () => {};
const getMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

export default function Header({
  user = { name: 'Account', image: null, userType: 'Not signed in' },
  onMenuClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getMountSnapshot,
    getServerMountSnapshot,
  );

  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'A';

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Reyansha Dashboard home"
        >
          <Image
            src="/logo.png"
            alt="Reyansha"
            width={100}
            height={50}
            priority
            className="h-auto w-[100px] object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle light and dark mode"
          disabled={!mounted}
          onClick={() =>
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
          }
        >
          {!mounted ? (
            <span className="size-4" />
          ) : resolvedTheme === 'dark' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({
              variant: 'ghost',
              className: 'flex h-auto items-center gap-2 px-2 py-1.5',
            })}
          >
            <Avatar className="size-9">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name} />
              )}
              <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="hidden min-w-0 text-left sm:block">
              <span className="block max-w-36 truncate text-sm font-medium">
                {user.name}
              </span>
              <span className="block max-w-36 truncate text-xs text-muted-foreground">
                {user.userType || 'User'}
              </span>
            </span>

            <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.userType || 'User'}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={onProfileClick}>
                <UserRound className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
