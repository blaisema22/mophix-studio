import { useMemo } from 'react';

function StatCard({ color = 'blue', title, value, subtitle, onClick }) {
  const colorClasses =
    color === 'blue'
      ? 'border-blue-500/30 bg-blue-500/10 text-blue-200'
      : color === 'orange'
      ? 'border-orange-500/30 bg-orange-500/10 text-orange-200'
      : color === 'green'
      ? 'border-green-500/30 bg-green-500/10 text-green-200'
      : 'border-red-500/30 bg-red-500/10 text-red-200';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col justify-between rounded-[1.6rem] border ${colorClasses} p-5 text-left hover:brightness-110 transition`}
    >
      <div className="text-sm text-white/80 font-semibold">{title}</div>
      <div className="mt-3">
        <div className="text-4xl font-extrabold">{value}</div>
        <div className="mt-1 text-sm text-white/70">{subtitle}</div>
      </div>
    </button>
  );
}

export default function StaffDashboardHome() {
  const staffName = useMemo(() => 'Staff', []);

  // NOTE: placeholders; wire to backend via bookings/photos/messages APIs.
  const todayBookingsCount = 3;
  const pendingBookingsCount = 5;
  const photosUploadedThisMonth = 42;
  const uploadsThisWeek = 11;
  const unreadMessagesCount = 4;

  const todaySessions = [
    {
      clientName: 'Alex Johnson',
      serviceName: 'Studio Portrait Session',
      time: '10:30 AM',
      status: 'Pending',
    },
    {
      clientName: 'Mary Jane',
      serviceName: 'Wedding Prep Photos',
      time: '1:15 PM',
      status: 'Confirmed',
    },
  ];

  const recentUnreadMessages = [
    { id: 1, sender: 'Grace', preview: 'Hi! Is the 2pm slot still available? Thanks!', time: 'Today' },
    { id: 2, sender: 'Peter', preview: 'Can I reschedule to Friday?', time: 'Today' },
    { id: 3, sender: 'Samantha', preview: 'Do you offer outdoor backgrounds?', time: 'Yesterday' },
    { id: 4, sender: 'Daniel', preview: 'I need a quote for 2 hours package.', time: 'Yesterday' },
  ];

  const recentPhotos = [
    { id: 1, src: '/assets/Family.jpeg', galleryName: 'Family Session', date: 'May 20, 2026' },
    { id: 2, src: '/assets/wedding.jpeg', galleryName: 'Wedding Preview', date: 'May 19, 2026' },
    { id: 3, src: '/assets/party.jpeg', galleryName: 'Birthday Shoot', date: 'May 18, 2026' },
    { id: 4, src: '/assets/studio.webp', galleryName: 'Studio Portrait', date: 'May 17, 2026' },
    { id: 5, src: '/assets/outdoor.jpeg', galleryName: 'Outdoor Session', date: 'May 16, 2026' },
    { id: 6, src: '/assets/pregnancy.webp', galleryName: 'Maternity Session', date: 'May 15, 2026' },
  ];

  const pendingBookings = [
    {
      id: 1,
      clientName: 'Tina',
      service: 'Portrait Session',
      date: 'May 22, 2026',
      time: '9:00 AM',
    },
    {
      id: 2,
      clientName: 'Ron',
      service: 'Event Coverage',
      date: 'May 23, 2026',
      time: '4:30 PM',
    },
  ];

  return (
    <div className="space-y-6">
      {/* WELCOME ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.35em] text-gray-500">Welcome</div>
          <div className="text-2xl font-bold">Good morning, {staffName}</div>
          <div className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 h-11 text-white font-semibold hover:bg-orange-600 transition"
        >
          Upload Photos
        </button>
      </div>

      {/* STATS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          color="blue"
          title="Today's Bookings"
          value={todayBookingsCount}
          subtitle={`Next session: 10:30 AM`}
        />
        <StatCard
          color="orange"
          title="Pending Bookings"
          value={pendingBookingsCount}
          subtitle="Awaiting confirmation"
        />
        <StatCard
          color="green"
          title="Photos Uploaded"
          value={photosUploadedThisMonth}
          subtitle={`Uploads this week: ${uploadsThisWeek}`}
        />
        <StatCard
          color="red"
          title="Unread Messages"
          value={unreadMessagesCount}
          subtitle="Needs reply"
        />
      </div>

      {/* TWO-COLUMN PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Today's Sessions */}
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-lg">Today's Sessions</div>
            <button type="button" className="text-orange-300 hover:text-orange-200 text-sm">
              View calendar
            </button>
          </div>

          <div className="space-y-3">
            {todaySessions.map((s, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{s.clientName}</div>
                  <div className="text-sm text-gray-400">
                    {s.serviceName} · {s.time}
                  </div>
                </div>
                <div
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    s.status === 'Confirmed'
                      ? 'border-green-500/30 bg-green-500/10 text-green-200'
                      : 'border-orange-500/30 bg-orange-500/10 text-orange-200'
                  }`}
                >
                  {s.status}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm hover:border-orange-500/40"
                  >
                    Update Status
                  </button>
                  {/* dropdown placeholder */}
                  <div className="hidden group-hover:block absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-[#0b0b0b] p-2 text-sm">
                    <button type="button" className="w-full text-left px-3 py-2 hover:bg-white/5">
                      Confirmed
                    </button>
                    <button type="button" className="w-full text-left px-3 py-2 hover:bg-white/5">
                      Completed
                    </button>
                    <button type="button" className="w-full text-left px-3 py-2 hover:bg-white/5">
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unread Messages */}
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-lg">Unread Messages</div>
            <button type="button" className="text-orange-300 hover:text-orange-200 text-sm">
              Open inbox
            </button>
          </div>

          <div className="space-y-3">
            {recentUnreadMessages.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3"
              >
                <div className="h-3 w-3 rounded-full bg-orange-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{m.sender}</div>
                  <div className="text-sm text-gray-400 truncate">{m.preview}</div>
                </div>
                <div className="text-sm text-gray-500">{m.time}</div>
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 transition px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm hover:border-orange-500/40"
                >
                  Reply
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT PHOTO UPLOADS */}
      <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
        <div className="font-bold text-lg mb-4">Recent Photo Uploads</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {recentPhotos.map((p) => (
            <div key={p.id} className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
              <img src={p.src} alt={p.galleryName} className="w-full aspect-square object-cover" />
              <button
                type="button"
                className="absolute top-2 right-2 h-9 w-9 rounded-full border border-white/10 bg-[#0b0b0b]/80 text-white/90 opacity-0 group-hover:opacity-100 transition"
                aria-label="Delete"
              >
                ✕
              </button>
              <div className="p-3">
                <div className="text-sm font-semibold truncate">{p.galleryName}</div>
                <div className="text-xs text-gray-400">{p.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PENDING BOOKINGS TABLE */}
      <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
        <div className="font-bold text-lg mb-4">Pending Bookings</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-3 px-2">Client Name</th>
                <th className="py-3 px-2">Service</th>
                <th className="py-3 px-2">Session Date</th>
                <th className="py-3 px-2">Session Time</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((b) => (
                <tr key={b.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                  <td className="py-4 px-2 font-semibold">{b.clientName}</td>
                  <td className="py-4 px-2 text-gray-300">{b.service}</td>
                  <td className="py-4 px-2 text-gray-300">{b.date}</td>
                  <td className="py-4 px-2 text-gray-300">{b.time}</td>
                  <td className="py-4 px-2">
                    <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-200">
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="inline-flex gap-2">
                      <button type="button" className="rounded-xl px-4 py-2 bg-green-500/15 border border-green-500/30 text-green-200 hover:bg-green-500/25">
                        Confirm
                      </button>
                      <button type="button" className="rounded-xl px-4 py-2 bg-red-500/15 border border-red-500/30 text-red-200 hover:bg-red-500/25">
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

