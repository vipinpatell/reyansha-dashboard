
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface ModuleTileProps {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function ModuleTile({
  name,
  description,
  href,
  icon: Icon,
}: ModuleTileProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group flex min-h-40 flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>

        <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>

      <h3 className="text-base font-semibold text-foreground">
        {name}
      </h3>

      <p className="mt-1 text-sm leading-5 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}
