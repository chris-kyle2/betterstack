import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Globe, Database, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
   
    { name: 'Endpoints', href: '/endpoints', icon: Globe },
    { name: 'Logs', href: '/logs', icon: Database },
   
  ];

  // Extract current page title
  const currentPage = navigation.find(item => 
    location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-dark-800 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-dark-700 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-dark-600">
          <div className="flex items-center gap-2 text-primary-500">
            <Activity size={24} />
            <span className="text-xl font-bold">PulseMonitor</span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)]">
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-dark-600 text-primary-500'
                        : 'text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Profile & Logout */}
          <div className="border-t border-dark-600 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                  {user?.attributes?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">
                  {user?.attributes?.email || 'User'}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white py-1 px-2 -ml-2 mt-1"
                  onClick={logout}
                  icon={LogOut}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-dark-700 border-b border-dark-600">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button
                className="text-gray-400 focus:outline-none lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-4 lg:ml-0 text-lg font-semibold text-white">
                {currentPage?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-full bg-dark-600 p-1 text-gray-400 hover:text-white">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-dark-800 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;