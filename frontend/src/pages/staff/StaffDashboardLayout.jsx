import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '../../store';
import {
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineCamera,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineKey,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlinePhotograph,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineSearch,
} from 'react-icons/hi';

const sidebarItems = [
  {
    header: 'OVERVIEW',
    items: [
      {
        icon: <HiOutlineChartBar className="h-5 w-5" />, 
        label: 'Dashboard',
        to: '/staff/dashboard',
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
        type: 'group',
        key: 'bookings',
        children: [
          { label: 'All Bookings', to: '/staff/bookings' },
          { label: 'Pending Approvals', to: '/staff/bookings/pending' },
          { label: 'Booking Calendar', to: '/staff/bookings/calendar' },
          { label: 'Update Booking Status', to: '/staff/bookings/update-status' },
        ],
      },
      {
        icon: <HiOutlineUsers className="h-5 w-5" />,
        label: 'Clients',
        type: 'group',
        key: 'clients',
        children: [
          { label: 'All Clients', to: '/staff/clients' },
          { label: 'Client Profiles', to: '/staff/clients/profiles' },
          { label: 'View Client Bookings', to: '/staff/clients/bookings' },
        ],
      },
      {
        icon: <HiOutlinePhotograph className="h-5 w-5" />,
        label: 'Portfolio',
        type: 'group',
        key: 'portfolio',
        children: [
          { label: 'All Galleries', to: '/staff/portfolio/galleries' },
          { label: 'Upload Photos', to: '/staff/portfolio/upload' },
          { label: 'Manage Photos', to: '/staff/portfolio/manage' },
          { label: 'Featured Photos', to: '/staff/portfolio/featured' },
        ],
      },
      {
        icon: <HiOutlineBriefcase className="h-5 w-5" />,
        label: 'Services',
        type: 'group',
        key: 'services',
        children: [
          { label: 'View All Services', to: '/staff/services' },
          { label: 'View Service Categories', to: '/staff/services/categories' },
        ],
      },
    ],
  },
  {
    header: 'CONTENT',
    items: [
      {
        icon: <HiOutlineDocumentText className="h-5 w-5" />,
        label: 'Blog Posts',
        type: 'group',
        key: 'blog',
        children: [
          { label: 'All Posts', to: '/staff/blog' },
          { label: 'Write New Post', to: '/staff/blog/write' },
          { label: 'My Drafts', to: '/staff/blog/drafts' },
          { label: 'Published Posts', to: '/staff/blog/published' },
        ],
      },
    ],
  },
  {
    header: 'INBOX',
    items: [
      {
        icon: <HiOutlineMail className="h-5 w-5" />,
        label: 'Messages',
        type: 'group',
        key: 'inbox',
        children: [
          { label: 'Unread Messages', to: '/staff/messages/unread' },
          { label: 'All Messages', to: '/staff/messages' },
          { label: 'Replied', to: '/staff/messages/replied' },
          { label: 'Archived', to: '/staff/messages/archived' },
        ],
      },
    ],
  },
  {
    header: 'ACCOUNT',
    items: [
      {
        icon: <HiOutlineUser className="h-5 w-5" />,
        label: 'My Profile',
        to: '/staff/account/profile',
        type: 'link',
      },
      {
        icon: <HiOutlineKey className="h-5 w-5" />,
        label: 'Change Password',
        to: '/staff/account/change-password',
        type: 'link',
      },
      {
        icon: <HiOutlineLogout className="h-5 w-5" />,
        label: 'Log Out',
        to: null,
        type: 'logout',
      },
    ],
  },
];

export default function StaffDashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const staffName = user?.first_name || user?.name || 'Staff';
  const avatarLetter = (staffName || 'S').charAt(0).toUpperCase();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openGroupKey, setOpenGroupKey] = useState(() => {
    // Expand the group that contains the active route.
    const match = sidebarItems
      .flatMap((s) => s.items)
      .filter((it) => it.type === 'group')
      .find((group) => group.children.some((c) => location.pathname.startsWith(c.to)));
    return match?.key || null;
  });

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentTitle = useMemo(() => {
    const flat = sidebarItems.flatMap((s) => s.items);
    const link = flat.find((it) => it.type === 'link' && location.pathname.startsWith(it.to));
    if (link?.label) return link.label === 'Dashboard' ? 'Dashboard' : link.label;

    const group = flat.find(
      (it) => it.type === 'group' && it.children.some((c) => location.pathname.startsWith(c.to))
    );
    if (group) {
      const child = group.children.find((c) => location.pathname.startsWith(c.to));
      return child?.label || group.label;
    }

    return 'Dashboard';
  }, [location.pathname]);

  useEffect(() => {
    const match = sidebarItems
      .flatMap((s) => s.items)
      .filter((it) => it.type === 'group')
      .find((group) => group.children.some((c) => location.pathname.startsWith(c.to)));
    setOpenGroupKey(match?.key || null);
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

  // NOTE: staff top-nav intentionally has NO settings gear icon.
  const unreadNotificationsCount = 0; // hook up to backend later

  return (
    <section className="min-h-screen bg-[#050505] text-white">
      {/* Top navigation bar (fixed) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070707] border-b border-orange-500/20">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-[260px]">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40"
            >
              <HiOutlineMenu className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-bold text-white">{currentTitle}</h1>
            </div>
          </div>

          {/* Center search */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-xl relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                className="w-full h-10 rounded-xl border border-white/10 bg-[#090909] pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-orange-500/60"
                placeholder="Search clients, bookings, photos..."
                onChange={() => {}}
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 min-w-[260px] justify-end">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40"
              >
                <HiOutlineBell className="h-5 w-5 text-white" />
              </button>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="h-10 rounded-xl border border-white/10 bg-white/5 hover:border-orange-500/40 px-3 flex items-center gap-2"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-300 font-bold">
                  {avatarLetter}
                </span>
                <span className="text-sm text-white whitespace-nowrap">{staffName}</span>
                <HiOutlineChevronDown className="text-gray-300 h-5 w-5" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-gradient-to-br from-[#090909] via-[#0d0d0d] to-[#0b0b0b] shadow-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/staff/account/profile');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/staff/account/change-password');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/5"
                  >
                    Change Password
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

      {/* Body with sidebar + content */}
      <div className="pt-16">
        <div className="flex">
          <aside
            className={`sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 bg-[#070707] border-r border-orange-500/20 overflow-y-auto ${
              sidebarCollapsed ? 'w-16' : 'w-64'
            }`}
          >
            {/* Logo */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 inline-flex items-center justify-center">
                  <HiOutlineCamera className="h-5 w-5 text-orange-400" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div className="font-serif text-orange-400 tracking-[0.06em] text-lg">Studio Lens</div>
                    <div className="text-[11px] uppercase tracking-[0.35em] text-gray-500">Staff Panel</div>
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

                      if (item.type === 'link') {
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-2 py-2 rounded-xl border border-transparent hover:bg-white/5 transition-colors ${
                                isActive
                                  ? 'bg-white/5 border-orange-500/40'
                                  : 'text-gray-200'
                              } ${
                                isActive ? 'shadow-[0_0_0_1px_rgba(249,115,22,0.3)]' : ''
                              } ${
                                sidebarCollapsed ? 'justify-center' : ''
                              }`
                            }
                          >
                            <span className="w-6 text-center">{item.icon}</span>
                            {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                          </NavLink>
                        );
                      }

                      // group
                      const isOpen = openGroupKey === item.key;
                      return (
                        <div key={item.key} className="rounded-xl border border-white/5 bg-white/0">
                          <button
                            type="button"
                            onClick={() => setOpenGroupKey((prev) => (prev === item.key ? null : item.key))}
                            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors ${
                              isOpen ? 'border-l-4 border-orange-500 bg-white/5' : 'border-l-4 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 text-center">{item.icon}</span>
                              {!sidebarCollapsed && <span className="text-sm text-gray-200">{item.label}</span>}
                            </div>
                            {!sidebarCollapsed && (
                              <span className="text-gray-300">
                                {isOpen ? (
                                  <HiOutlineChevronUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineChevronDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </button>

                          {isOpen && !sidebarCollapsed && (
                            <div className="pl-6 pr-2 pb-2">
                              {item.children.map((child) => (
                                <NavLink
                                  key={child.to}
                                  to={child.to}
                                  className={({ isActive }) =>
                                    `block px-3 py-2 rounded-xl border transition-all text-sm ${
                                      isActive
                                        ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                                        : 'border-white/10 text-gray-300 hover:border-orange-500/40 hover:bg-white/5'
                                    }`
                                  }
                                >
                                  {child.label}
                                </NavLink>
                              ))}
                            </div>
                          )}
                        </div>
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

