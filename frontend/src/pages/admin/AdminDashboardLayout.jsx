import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineMenu,
  HiOutlinePhotograph,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineInbox,
  HiOutlineKey,
  HiOutlineLogout,
} from 'react-icons/hi';

const sidebarItems = [
  {
    header: 'OVERVIEW',
    items: [
      {
        icon: <HiOutlineChartBar className="h-5 w-5" />,
        label: 'Admin Dashboard',
        to: '/admin',
        type: 'link',
      },
    ],
  },
  {
    header: 'MANAGEMENT',
    items: [
      {
        icon: <HiOutlineCalendar className="h-5 w-5" />,
        label: 'Bookings',
        type: 'link',
        to: '/admin/bookings',
      },
      {
        icon: <HiOutlinePhotograph className="h-5 w-5" />,
        label: 'Galleries',
        type: 'link',
        to: '/admin/galleries',
      },
      {
        icon: <HiOutlineDocumentText className="h-5 w-5" />,
        label: 'Blog',
        type: 'link',
        to: '/admin/blog',
      },
      {
        icon: <HiOutlineUsers className="h-5 w-5" />,
        label: 'Users',
        type: 'link',
        to: '/admin/users',
      },
      {
        icon: <HiOutlineInbox className="h-5 w-5" />,
        label: 'Inquiries',
        type: 'link',
        to: '/admin/inquiries',
      },
      {
        icon: <HiOutlineDocumentText className="h-5 w-5" />,
        label: 'Testimonials',
        type: 'link',
        to: '/admin/testimonials',
      },
    ],
  },
  {
    header: 'ACCOUNT',
    items: [
      {
        icon: <HiOutlineLogout className="h-5 w-5" />,
        label: 'Log Out',
        to: null,
        type: 'logout',
      },
    ],
  },
];

export default function AdminDashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentTitle = useMemo(() => {
    const flat = sidebarItems.flatMap((section) => section.items);
    const active = flat.find((item) => item.type === 'link' && location.pathname === item.to);
    return active?.label || 'Admin Dashboard';
  }, [location.pathname]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileMenuOpen) return;
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target)) return;
      setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [profileMenuOpen]);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const adminName = user?.first_name || user?.name || 'Admin';
  const avatarLetter = adminName.charAt(0).toUpperCase();

  return (
    <section className="min-h-screen bg-[#050505] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070707] border-b border-orange-500/20">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-[260px]">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40"
            >
              <HiOutlineMenu className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-bold text-white">{currentTitle}</h1>
              <p className="text-sm text-gray-400">Admin control panel</p>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-xl relative">
              <input
                className="w-full h-10 rounded-xl border border-white/10 bg-[#090909] pl-4 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/60"
                placeholder="Search admin workflows..."
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 min-w-[260px] justify-end">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40"
              >
                <HiOutlineBell className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="h-10 rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40 px-3 flex items-center gap-2"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-300 font-bold">
                  {avatarLetter}
                </span>
                <span className="text-sm text-white whitespace-nowrap">{adminName}</span>
                <HiOutlineChevronDown className="text-gray-300 h-5 w-5" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#0b0b0b] shadow-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/admin/users');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                  >
                    Manage Users
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/admin/inquiries');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                  >
                    Help & Inquiries
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-orange-300 hover:bg-white/5"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="flex">
          <aside
            className={`sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 bg-[#070707] border-r border-orange-500/20 overflow-y-auto ${
              sidebarCollapsed ? 'w-16' : 'w-64'
            }`}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 inline-flex items-center justify-center">
                  <HiOutlineUsers className="h-5 w-5 text-orange-400" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div className="font-serif text-orange-400 tracking-[0.06em] text-lg">Studio Lens</div>
                    <div className="text-[11px] uppercase tracking-[0.35em] text-gray-500">Admin Panel</div>
                  </div>
                )}
              </div>
            </div>

            <nav className="p-3">
              {sidebarItems.map((section) => (
                <div key={section.header} className="mb-5">
                  {!sidebarCollapsed && (
                    <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-[0.35em] text-gray-500">
                      {section.header}
                    </div>
                  )}

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      if (item.type === 'logout') {
                        return (
                          <button
                            key="logout"
                            type="button"
                            onClick={handleLogout}
                            className={`w-full flex items-center ${
                              sidebarCollapsed ? 'justify-center' : 'justify-start'
                            } gap-3 px-2 py-2 rounded-xl border border-transparent hover:bg-white/5 text-orange-300`}
                          >
                            <span>{item.icon}</span>
                            {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                          </button>
                        );
                      }

                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-2 py-2 rounded-xl border border-transparent hover:bg-white/5 transition-colors ${
                              isActive
                                ? 'bg-white/5 border-orange-500/40 shadow-[0_0_0_1px_rgba(249,115,22,0.3)] text-orange-300'
                                : 'text-gray-200'
                            } ${sidebarCollapsed ? 'justify-center' : ''}`
                          }
                        >
                          <span className="w-6 text-center">{item.icon}</span>
                          {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <main className="flex-1 p-6">
            <div className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#070707] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
