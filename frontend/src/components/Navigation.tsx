import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import logoSrc from '../assets/logo.png';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Track Application', path: '/track-application' },
];

const ROLE_DASHBOARD: Record<string, string> = {
  customer: '/dashboard',
  staff: '/staff',
  admin: '/admin',
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token && !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const dashboardPath = user ? ROLE_DASHBOARD[user.role] || '/' : '/';

  return (
    <nav className="bg-white shadow-sm border-b border-border-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoSrc} alt="Smart Palika Logo" className="w-24 h-16" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-text-secondary hover:text-primary-blue font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-1 text-text-secondary hover:text-primary-blue font-medium transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-text-secondary hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-blue text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-border-soft">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary-blue hover:bg-background-soft rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary-blue hover:bg-background-soft rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-background-soft rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-primary-blue hover:bg-background-soft rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
