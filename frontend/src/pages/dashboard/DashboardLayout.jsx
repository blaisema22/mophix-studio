import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { useEffect, useState } from 'react';

const sections = [
  {
    header: 'My Bookings',
    items: [
      { label: 'Book a New Session', to: '/dashboard/bookings/new' },
      { label: 'Upcoming Bookings', to: '/dashboard/bookings/upcoming' },
      { label: 'Booking History', to: '/dashboard/bookings/history' },
    ],
  },
  {
    header: 'My Galleries',
    items: [
      { label: 'View Delivered Photos', to: '/dashboard/galleries/view' },
      { label: 'Download Photos', to: '/dashboard/galleries/download' },
    ],
  },
  {
    header: 'Testimonials',
    items: [
      { label: 'Write a Review', to: '/dashboard/testimonials/write' },
      { label: 'My Submitted Reviews', to: '/dashboard/testimonials/submitted' },
    ],
  },
  {
    header: 'Account',
    items: [
      { label: 'My Profile', to: '/dashboard/account/profile' },
      { label: 'Change Password', to: '/dashboard/account/change-password' },
    ],
  },
];

const titleMap = [
  { path: '/dashboard/bookings/new', title: 'Book a New Session' },
  { path: '/dashboard/bookings/upcoming', title: 'Upcoming Bookings' },
  { path: '/dashboard/bookings/history', title: 'Booking History' },
  { path: '/dashboard/galleries/view', title: 'View Delivered Photos' },
  { path: '/dashboard/galleries/download', title: 'Download Photos' },
  { path: '/dashboard/testimonials/write', title: 'Write a Review' },
  { path: '/dashboard/testimonials/submitted', title: 'My Submitted Reviews' },
  { path: '/dashboard/account/profile', title: 'My Profile' },
  { path: '/dashboard/account/change-password', title: 'Change Password' },
  { path: '/dashboard/bookings', title: 'My Bookings' },
  { path: '/dashboard/galleries', title: 'My Galleries' },
  { path: '/dashboard/testimonials', title: 'Testimonials' },
  { path: '/dashboard/account', title: 'Account' },
  { path: '/dashboard', title: 'Dashboard' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openSections, setOpenSections] = useState(() =>
    sections.reduce((acc, section) => ({ ...acc, [section.header]: false }), {})
  );

  const currentTitle = titleMap.find((item) => location.pathname.startsWith(item.path))?.title || 'Dashboard';

  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.items.some((item) => location.pathname.startsWith(item.to))
    );
    if (activeSection) {
      setOpenSections((prev) => 
        sections.reduce((acc, section) => ({ ...acc, [section.header]: section.header === activeSection.header }), {})
      );
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section className="min-h-screen bg-[#070707] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="lg:flex lg:gap-6">
          <aside className={`sticky top-6 self-start rounded-[1.5rem] border border-orange-500/20 bg-[#111111] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-[calc(100vh-4rem)] overflow-y-auto`}>
            <div className={`mb-5 ${isCollapsed ? 'text-center' : ''}`}>
              <p className="text-[10px] uppercase tracking-[0.45em] text-orange-400/80">Client space</p>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.header} className="rounded-[1.5rem] border border-white/10 bg-[#0f0f0f] p-1">
                  <button
                    type="button"
                    onClick={() => setOpenSections((prev) => ({
                      ...prev,
                      [section.header]: !prev[section.header],
                    }))}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-gray-200 transition hover:bg-white/5"
                  >
                    <span className="flex items-center gap-3">
                      {/* Removed circular initial badge; show label only */}
                      {!isCollapsed && <span className="font-semibold">{section.header}</span>}
                    </span>
                    {!isCollapsed && (
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 transition ${openSections[section.header] ? 'bg-orange-500/10 text-orange-300' : 'text-gray-400'}`}>
                        {openSections[section.header] ? '−' : '+'}
                      </span>
                    )}
                  </button>

                  {openSections[section.header] && !isCollapsed && (
                    <div className="mt-2 space-y-2 px-4 pb-3">
                      {section.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block rounded-2xl border px-4 py-3 text-sm transition-all ${
                              isActive
                                ? 'border-orange-500 bg-orange-500/10 text-orange-300 shadow-[0_0_0_1px_rgba(249,115,22,0.3)]'
                                : 'border-white/10 text-gray-300 hover:border-orange-500/40 hover:bg-white/5'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isCollapsed && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <button type="button" onClick={handleLogout} className="w-full rounded-2xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-sm text-orange-300 hover:bg-orange-500/20">
                  Log Out
                </button>
              </div>
            )}
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-orange-500/20 bg-[#111111] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCollapsed((prev) => !prev)}
                  className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/40 hover:bg-white/10"
                >
                  <span className="text-xl">☰</span>
                </button>
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Current page</p>
                  <h1 className="text-2xl font-semibold">{currentTitle}</h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <button className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-gray-300 hover:border-orange-500/40 hover:bg-white/10">
                  🔔
                </button>
                <button onClick={() => navigate('/dashboard/bookings/new')} className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-gray-300 hover:border-orange-500/40 hover:bg-white/10">
                  📅 Book a Session
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="inline-flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-gray-300 hover:border-orange-500/40 hover:bg-white/10"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-300">{user?.first_name?.charAt(0) || 'U'}</span>
                    <span>{user?.first_name || 'User'}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-[#111111] p-3 shadow-xl">
                      <button type="button" onClick={() => navigate('/dashboard/account/profile')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5">My Profile</button>
                      <button type="button" onClick={() => navigate('/dashboard/account/change-password')} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5">Change Password</button>
                      <button type="button" onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-orange-300 hover:bg-white/5">Log Out</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-orange-500/20 bg-[#0f0f0f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
