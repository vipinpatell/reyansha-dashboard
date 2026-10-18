
import CopyrightYear from './copyright-year';

const APP_VERSION = '1.0.0';

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-3 text-xs text-zinc-500 sm:flex-row sm:px-6">
        <p className="text-center sm:text-left">
          © <CopyrightYear /> Reyansha Ecosystem. All rights reserved.
        </p>

        <p className="text-muted-foreground">
          Version {APP_VERSION}
        </p>
      </div>
    </footer>
  );
}
