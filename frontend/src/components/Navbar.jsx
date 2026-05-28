import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../store';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-orange-400' : 'text-white hover:text-orange-300 transition-colors';

  const mobileNavLinkClass = ({ isActive }) =>
    isActive ? 'text-orange-400 font-semibold' : 'text-white hover:text-orange-300 transition-colors';

  return (
    <header className="bg-black border-b border-orange-400/20 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-orange-400 hover:text-orange-300 focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <HiOutlineXMark className="h-6 w-6" />
            ) : (
              <HiOutlineBars3 className="h-6 w-6" />
            )}

          </button>
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-2xl font-serif text-orange-400 tracking-[0.08em] whitespace-nowrap"
          >
            Mophix Studio
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/portfolio" className={navLinkClass}>Portfolio</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>
          <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="flex flex-wrap items-center gap-4">
          {isAuthenticated ? (
            <>
              {(user?.role === 'client' || user?.role === 'customer') && (
                <Link to="/dashboard" className="text-sm text-gray-300 hover:text-orange-400 transition-colors">
                  Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm text-gray-300 hover:text-orange-400 transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn-outline text-sm">
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

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-orange-500/10 bg-gradient-to-b from-[#040404] to-[#090909] px-4 py-6 shadow-xl">
          <nav className="flex flex-col gap-5 text-sm font-medium">
            <NavLink to="/" end onClick={closeMobileMenu} className={mobileNavLinkClass}>Home</NavLink>
            <NavLink to="/portfolio" onClick={closeMobileMenu} className={mobileNavLinkClass}>Portfolio</NavLink>
            <NavLink to="/services" onClick={closeMobileMenu} className={mobileNavLinkClass}>Services</NavLink>
            <NavLink to="/blog" onClick={closeMobileMenu} className={mobileNavLinkClass}>Blog</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className={mobileNavLinkClass}>Contact</NavLink>

            {isAuthenticated && (
              <div className="pt-5 mt-2 border-t border-white/5 flex flex-col gap-4">
                {(user?.role === 'client' || user?.role === 'customer') && (
                  <Link to="/dashboard" onClick={closeMobileMenu} className="text-gray-300 hover:text-orange-400 transition-colors">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={closeMobileMenu} className="text-gray-300 hover:text-orange-400 transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-outline text-sm w-fit">
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;