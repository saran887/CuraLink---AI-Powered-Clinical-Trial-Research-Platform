import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CuraLink</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link
                  to={user.role === 'patient' ? '/patient/dashboard' : '/researcher/dashboard'}
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {user.role === 'patient' && (
                  <Link
                    to="/patient/experts"
                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                  >
                    Health Experts
                  </Link>
                )}
                {user.role === 'researcher' && (
                  <Link
                    to="/researcher/collaborators"
                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                  >
                    Collaborators
                  </Link>
                )}
                <Link
                  to="/forum"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Forum
                </Link>
                <Link
                  to="/favorites"
                  className="text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Favorites
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
