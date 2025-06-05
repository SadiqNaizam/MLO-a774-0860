import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, CreditCard, Settings } from 'lucide-react'; // Example icons

// TSB Brand Colors
const TSB_PRIMARY_COLOR = '#00A8E1';
const TSB_TEXT_COLOR = '#131B33';
const TSB_LIGHT_TEXT_COLOR = '#5A647D'; // A lighter text for inactive items

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2 sm:px-3 sm:py-2 ${
        isActive ? 'text-[--tsb-primary]' : 'text-[--tsb-light-text]'
      }`}
      style={
        {
          '--tsb-primary': TSB_PRIMARY_COLOR,
          '--tsb-light-text': TSB_LIGHT_TEXT_COLOR,
        } as React.CSSProperties
      }
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `h-5 w-5 ${isActive ? 'text-[--tsb-primary]' : 'text-[--tsb-light-text]'}`,
      })}
      <span className={`text-xs sm:text-sm font-medium ${isActive ? 'text-[--tsb-primary]' : 'text-[--tsb-light-text]'}`}>
        {label}
      </span>
    </Link>
  );
};

const NavigationMenu: React.FC = () => {
  console.log("Rendering NavigationMenu");
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { to: '/transfer', icon: <ArrowRightLeft />, label: 'Transfers' },
    { to: '/payments', icon: <CreditCard />, label: 'Payments' },
    { to: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  // This example creates a bottom tab bar for mobile and a sidebar for larger screens.
  // You can adapt the styling as needed.
  return (
    <>
      {/* Bottom Tab Bar for mobile (print:hidden to hide on print) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around sm:hidden z-40 print:hidden">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname.startsWith(item.to)}
          />
        ))}
      </nav>

      {/* Sidebar for larger screens (print:hidden to hide on print) */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-gray-50 border-r border-gray-200 p-4 space-y-2 fixed top-16 bottom-0 left-0 z-30 print:hidden">
         {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname.startsWith(item.to)}
          />
        ))}
      </aside>
    </>
  );
};

export default NavigationMenu;