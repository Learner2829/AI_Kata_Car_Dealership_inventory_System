import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isStaff, username, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-blue-700 text-white'
        : 'text-gray-300 hover:bg-blue-600 hover:text-white'
    }`;

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold tracking-tight">
              Car Dealership
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link to="/" className={linkClass('/')}>
                  Dashboard
                </Link>
                {isStaff && (
                  <span className="text-yellow-300 text-xs font-semibold px-2 py-1 bg-blue-900 rounded">
                    Admin
                  </span>
                )}
                <span className="text-gray-400 text-sm px-2">{username}</span>
                <button
                  onClick={logout}
                  className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass('/login')}>
                  Login
                </Link>
                <Link to="/register" className={linkClass('/register')}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
