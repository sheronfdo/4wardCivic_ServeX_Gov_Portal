import { useContext, useState } from 'react';
import { Menu, X, BarChart3, Settings, User, CheckSquare, Grid3X3, Bell, Search } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ServeX from '../assets/logo/ServeX.png'
import { AuthContext } from '../context/AuthContext';
// Layout Component
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const navigationItems = [
    { icon: Grid3X3, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Services', path: '/services' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  const handleImageClick = () => {
    navigate('/'); // Navigate to home
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogoutCancel}
                className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-500 to-blue-600 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-400">
          <div
            onClick={handleImageClick}
            className="w-20 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <img
              src={ServeX} alt="Description of the image"
              className="w-10 h-10 md:w-15 md:h-15  flex items-center justify-center" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {(() => {
                const currentItem = navigationItems.find(item => item.path === location.pathname);
                const IconComponent = currentItem?.icon || Grid3X3;
                return <IconComponent className="w-5 h-5 text-blue-600" />;
              })()}
            </div>
            <span className="text-white font-semibold">
              {navigationItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 mt-auto mt-20">
          <button
            onClick={handleLogoutClick}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white flex items-center justify-center space-x-2 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Overview</span>
                <span>•</span>
                <span>Tasks</span>
                <span>•</span>
                <span>Documents</span>
                <span>•</span>
                <span>Reports</span>
                <span>•</span>
                <span>Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - This is where child routes will render */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;