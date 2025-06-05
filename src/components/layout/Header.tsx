import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle2, Bell } from 'lucide-react'; // Example icons

// TSB Brand Colors
// Primary: #00A8E1
// Text: #131B33
// Background: #FFFFFF (often default)

const Header: React.FC = () => {
  console.log("Rendering Header");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              {/* Placeholder for TSB Logo */}
              <span className="font-bold text-xl" style={{ color: '#131B33' }}>TSB Bank</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" style={{ color: '#131B33' }} />
            </Button>
            <Link to="/settings/profile"> {/* Example link to user profile/settings */}
              <Button variant="ghost" size="icon" aria-label="User Account">
                <UserCircle2 className="h-6 w-6" style={{ color: '#131B33' }} />
              </Button>
            </Link>
            {/* Potentially a Logout Button */}
            {/* <Button variant="outline" size="sm" style={{ borderColor: '#00A8E1', color: '#00A8E1' }}>Logout</Button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;