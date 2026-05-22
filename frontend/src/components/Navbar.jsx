import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../store';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-b from-[#050505] via-[#090909] to-[#040404] border-b border-orange-500/20 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-accent hover:text-orange-400 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <Link to="/" onClick={closeMobileMenu} className="text-2xl font-serif text-orange-400 tracking-[0.08em] whitespace-nowrap">Mophix Studio</Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-accent">
          <NavLink to="/" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-accent'} hover:text-orange-300`}>Home</NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-accent'} hover:text-orange-300`}>Portfolio</NavLink>
          <NavLink to="/services" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-accent'} hover:text-orange-300`}>Services</NavLink>
          <NavLink to="/blog" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-accent'} hover:text-orange-300`}>Blog</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `${isActive ? 'text-orange-400' : 'text-accent'} hover:text-orange-300`}>Contact</NavLink>
        </nav>

        <div className="flex flex-wrap items-center gap-4">
          {isAuthenticated ? (
            <>
              {(user?.role === 'client' || user?.role === 'customer') && (
                <Link to="/dashboard" className="text-sm text-gray-300 hover:text-orange-400">Dashboard</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm text-gray-300 hover:text-orange-400">Admin</Link>
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

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-orange-500/10 bg-gradient-to-b from-[#040404] to-[#090909] px-4 py-6 shadow-xl">
          <nav className="flex flex-col gap-5 text-sm font-medium">
            <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'text-orange-400' : 'text-gray-300 hover:text-orange-300'}>Home</NavLink>
            <NavLink to="/portfolio" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'text-orange-400' : 'text-gray-300'}>Portfolio</NavLink>
            <NavLink to="/services" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'text-orange-400' : 'text-gray-300'}>Services</NavLink>
            <NavLink to="/blog" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'text-orange-400' : 'text-gray-300'}>Blog</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'text-orange-400' : 'text-gray-300'}>Contact</NavLink>
            
            {isAuthenticated && (
              <div className="pt-5 mt-2 border-t border-white/5 flex flex-col gap-4">
                {(user?.role === 'client' || user?.role === 'customer') && (
                  <Link to="/dashboard" onClick={closeMobileMenu} className="text-gray-300 hover:text-orange-400">Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={closeMobileMenu} className="text-gray-300 hover:text-orange-400">Admin</Link>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
