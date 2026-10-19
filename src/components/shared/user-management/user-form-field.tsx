import type { ReactNode } from 'react';

interface UserFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

export const userInputClass =
  'h-11 w-full rounded-sm border border-input bg-background px-3 text-sm  outline-none transition placeholder:text-muted-foreground/70 hover:border-ring/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50';

export default function UserFormField({
  id,
  label,
  required = false,
  children,
}: UserFormFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 flex min-h-5 items-center gap-1.5 text-sm font-medium">
        <span>{label}</span>
        {required ? (
          <span aria-label="required" className="text-destructive">
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}
