import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const OwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isOwnerLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/owner');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/owner/dashboard' },
    { label: 'Calendar', icon: Calendar, path: '/owner/calendar' },
    { label: 'Bookings', icon: ClipboardList, path: '/owner/bookings' },
    { label: 'Profile', icon: User, path: '/owner/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto px-4 pt-6">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 px-4 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-full h-full",
                isActive ? "text-blue-600" : "text-gray-500"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default OwnerLayout;
