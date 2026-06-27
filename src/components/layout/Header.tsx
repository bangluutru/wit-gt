import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="header-bar lg:hidden sticky top-0 z-30 h-14 flex items-center justify-between px-4 bg-wit-surface/80 backdrop-blur-md border-b border-wit-line">
      {/* Menu button */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg text-wit-text-secondary hover:bg-wit-surface-alt transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo centered */}
      <NavLink to="/" className="absolute left-1/2 -translate-x-1/2">
        <img src="/logo.png" alt="WiT" className="h-8 w-auto" />
      </NavLink>

      {/* Spacer for symmetry */}
      <div className="w-9" />
    </header>
  );
}
