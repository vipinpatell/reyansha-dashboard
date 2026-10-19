import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface UserFormSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

export default function UserFormSection({
  icon: Icon,
  title,
  description,
  children,
}: UserFormSectionProps) {
  return (
    <section className="overflow-hidden rounded-sm border bg-card shadow-sm">
      <div className="flex items-start gap-3 border-b bg-muted/20 p-5 sm:p-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
