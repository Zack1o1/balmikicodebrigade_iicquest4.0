import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { logout } from "../store/authSlice";
import type { RootState, AppDispatch } from "../store";
import logoSrc from "../assets/logo.png";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Track Application", path: "/track-application" },
  { name: "Smart Palika AI", path: "/smart-palika-ai" },
];

const ROLE_DASHBOARD: Record<string, string> = {
  citizen: "/dashboard",
  ward: "/staff",
  admin: "/admin",
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, token } = useSelector((state: RootState) => state.auth);

  const isAuthenticated = !!token && !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const dashboardPath = user ? ROLE_DASHBOARD[user.role] || "/" : "/";

  return (
    <nav className="bg-white my-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logoSrc}
                alt="Smart Palika Logo"
                className="w-16 h-16 object-contain"
              />
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
                  className="flex items-center gap-2 text-text-secondary hover:text-primary-blue font-medium transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-text-secondary hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 bg-primary-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-border-soft  shadow-sm">
          <div className="px-3 py-3 space-y-1">

            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className=" px-3 py-3 rounded-lg text-base font-medium text-text-secondary hover:text-primary-blue hover:bg-gray-50 flex items-center justify-center"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-text-secondary hover:text-primary-blue hover:bg-gray-50"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-lg border border-primary-blue text-primary-blue font-medium hover:bg-primary-blue hover:text-white transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-lg bg-primary-red text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}