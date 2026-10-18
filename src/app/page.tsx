
'use client';

import { useState } from 'react';
import { Maximize2, Columns2, PanelLeft, PanelRight } from 'lucide-react';

import HeaderContainer from '@/components/shared/header/header-container';
import Footer from '@/components/shared/footer/page';
import { Button } from '@/components/ui/button';
import Tiles from '@/components/shared/tiles/page';

type ViewMode = 'split' | 'left' | 'right';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <HeaderContainer />

      <main className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Panel controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Reyansha Dashboard
          </h1>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === 'split' ? 'default' : 'outline'}
              onClick={() => setViewMode('split')}
              aria-label="Show both panels"
            >
              <Columns2 className="mr-2 size-4" />
              Split
            </Button>

            <Button
              size="sm"
              variant={viewMode === 'left' ? 'default' : 'outline'}
              onClick={() => setViewMode('left')}
              aria-label="Expand left panel"
            >
              <PanelLeft className="mr-2 size-4" />
              Left
            </Button>

            <Button
              size="sm"
              variant={viewMode === 'right' ? 'default' : 'outline'}
              onClick={() => setViewMode('right')}
              aria-label="Expand right panel"
            >
              <PanelRight className="mr-2 size-4" />
              Right
            </Button>
          </div>
        </div>

        {/* Main panels */}
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          {viewMode !== 'right' && (
            <section
              className={`min-h-[300px] rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${
                viewMode === 'left'
                  ? 'w-full'
                  : 'w-full lg:w-[40%] lg:flex-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Left Panel</h2>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Expand left panel"
                  onClick={() => setViewMode(viewMode === 'left' ? 'split' : 'left')}
                >
                  <Maximize2 className="size-4" />
                </Button>
              </div>

              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Left panel content goes here.
              </p>
            </section>
          )}

          {viewMode !== 'left' && (
            <section
              className={`min-h-[300px] rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 ${
                viewMode === 'right'
                  ? 'w-full'
                  : 'w-full lg:min-w-0 lg:flex-1'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Right Panel</h2>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Expand right panel"
                  onClick={() => setViewMode(viewMode === 'right' ? 'split' : 'right')}
                >
                  <Maximize2 className="size-4" />
                </Button>
              </div>

              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Right panel content goes here.
              </p>
              <Tiles />
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
