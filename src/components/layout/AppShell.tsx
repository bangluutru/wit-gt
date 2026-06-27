// ============================================================
// WiT Platform - AppShell Layout Component
// ============================================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-wit-paper text-wit-text antialiased">
      {/* Sidebar with drawer support */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main layout container shifted left on desktop */}
      <div className="lg:pl-[280px] min-h-dvh flex flex-col">
        {/* Header always visible at the top of content */}
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-8">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
