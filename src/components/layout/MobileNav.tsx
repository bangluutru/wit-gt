import { NavLink } from 'react-router-dom';
import { Home, Map, BookOpen, Languages, Settings, type LucideIcon } from 'lucide-react';
import { NAV_ITEMS } from '../../lib/constants';
import { useSettings } from '../../contexts/SettingsContext';
import { getLocalized } from '../../lib/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Map,
  BookOpen,
  Languages,
  Settings,
};

export function MobileNav() {
  const { interfaceLang } = useSettings();

  return (
    <nav className="mobile-nav lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-wit-surface/95 backdrop-blur-md border-t border-wit-line safe-area-bottom">
      <div className="flex items-stretch justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const label = getLocalized(item, 'label', interfaceLang);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-wit-red' : 'text-wit-text-tertiary'
                }`
              }
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="truncate max-w-[56px]">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
