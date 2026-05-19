import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#090909] border-b border-orange-500/20 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-serif text-orange-400 tracking-[0.08em]">Mophix Studio</Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <NavLink to="/" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-gray-300'} hover:text-orange-300`}>Home</NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-gray-300'} hover:text-orange-300`}>Portfolio</NavLink>
          <NavLink to="/services" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-gray-300'} hover:text-orange-300`}>Services</NavLink>
          <NavLink to="/blog" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-gray-300'} hover:text-orange-300`}>Blog</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-gray-300'} hover:text-orange-300`}>Contact</NavLink>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm text-dark hover:text-primary">My Profile</Link>
              {user?.role === 'client' && (
                <Link to="/my-bookings" className="text-sm text-dark hover:text-primary">My Bookings</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm text-dark hover:text-primary">Admin</Link>
              )}
              <button
                onClick={handleLogout}
                className="btn-outline text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
