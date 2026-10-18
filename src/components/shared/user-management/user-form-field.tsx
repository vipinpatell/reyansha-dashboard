import type { ReactNode } from 'react';

interface UserFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}

export const userInputClass =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring';

export default function UserFormField({
  id,
  label,
  required = false,
  children,
}: UserFormFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        <span
          className={
            required
              ? 'ml-2 text-xs font-normal text-destructive'
              : 'ml-2 text-xs font-normal text-muted-foreground'
          }
        >
          {required ? 'Required' : 'Optional'}
        </span>
      </label>
      {children}
    </div>
  );
}
