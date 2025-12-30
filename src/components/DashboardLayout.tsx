
import React from 'react';
import { cn } from '@/lib/utils';
import { Moon } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-800 rounded-lg">
              <Moon className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">Zakat<span className="text-yellow-400">Dash</span></h1>
          </div>
          <div className="text-sm text-emerald-200">
            Corporate Wealth Purification
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative">
        {/* Background Pattern (CSS-based subtle geometry) */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="islamic-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#islamic-pattern)" className="text-emerald-900" />
            </svg>
        </div>

        <div className="relative z-10">
            {children}
        </div>
      </main>
    </div>
  );
}
