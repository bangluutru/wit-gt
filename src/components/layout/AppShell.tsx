import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-wit-paper">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile header */}
      <Header />

      {/* Main content area */}
      <main className="main-content lg:ml-[260px] min-h-screen pb-20 lg:pb-0">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
