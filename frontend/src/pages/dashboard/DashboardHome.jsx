import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { bookingsService, galleriesService, testimonialsService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardHome = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ upcoming: null, galleryCount: 0, recentGallery: null, averageRating: null });

  useEffect(() => {
    const loadSummary = async () => {
      if (!user) return;

      try {
        const [bookingsResponse, galleriesResponse, ratingResponse] = await Promise.all([
          bookingsService.getAll({ user_id: user.user_id, limit: 5 }),
          galleriesService.getAll({ created_by: user.user_id, is_published: true, limit: 5 }),
          testimonialsService.getAverageRating(),
        ]);

        const bookings = bookingsResponse.data || [];
        const upcoming = bookings.find((booking) => ['pending', 'confirmed'].includes(booking.status));
        const galleries = galleriesResponse.data || [];

        setSummary({
          upcoming,
          galleryCount: galleries.length,
          recentGallery: galleries[0] || null,
          averageRating: ratingResponse.data?.average_rating || null,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [user]);

  const upcoming = summary.upcoming;
  const recentGallery = summary.recentGallery;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-orange-400/80">Dashboard</p>
          <h1 className="section-title">My Dashboard</h1>
          <p className="section-subtitle">A quick overview of your upcoming sessions, galleries, and account activity.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/bookings" className="btn-primary">View bookings</Link>
          <Link to="/dashboard/galleries" className="btn-outline">View galleries</Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-10"><LoadingSpinner /></div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] mt-8">
          <section className="space-y-6">
            <article className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-orange-400/80">Upcoming Session</p>
                  <h2 className="text-2xl font-semibold">{upcoming ? upcoming.Service?.name || `Booking #${upcoming.booking_id}` : 'No upcoming session yet'}</h2>
                  <p className="mt-2 text-gray-400">{upcoming ? `${new Date(upcoming.event_date).toLocaleDateString()} at ${upcoming.preferred_time_start || 'TBD'}` : 'Book a session to see it here.'}</p>
                </div>
                <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                  {upcoming ? upcoming.status : 'Pending'}
                </span>
              </div>
              {upcoming && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-semibold text-white">{upcoming.event_location || 'Not set'}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Participants</p>
                    <p className="font-semibold text-white">{upcoming.number_of_participants || '1'}</p>
                  </div>
                </div>
              )}
            </article>

            <article className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-orange-400/80">Recent Gallery</p>
                  <h2 className="text-2xl font-semibold">{recentGallery?.title || 'No gallery yet'}</h2>
                  <p className="mt-2 text-gray-400">{recentGallery?.published_date ? new Date(recentGallery.published_date).toLocaleDateString() : 'Your latest gallery will appear here.'}</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                  {recentGallery ? 'Ready' : 'Empty'}
                </span>
              </div>
              <div className="mt-6 rounded-3xl bg-white/5 p-5">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Total galleries</span>
                  <span>{summary.galleryCount}</span>
                </div>
              </div>
            </article>
          </section>

          <section className="space-y-6">
            <article className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
              <h3 className="text-xl font-semibold">Quick Actions</h3>
              <p className="mt-2 text-gray-400">Book a new session or manage your account in one place.</p>
              <div className="grid gap-4 mt-6">
                <Link to="/dashboard/bookings" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left transition hover:border-orange-500/40">
                  <p className="font-semibold text-white">Book Session</p>
                  <p className="text-sm text-gray-400 mt-1">Create or update your next photo session.</p>
                </Link>
                <Link to="/dashboard/galleries" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left transition hover:border-orange-500/40">
                  <p className="font-semibold text-white">My Galleries</p>
                  <p className="text-sm text-gray-400 mt-1">See your delivered sessions and photos.</p>
                </Link>
                <Link to="/dashboard/testimonials" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left transition hover:border-orange-500/40">
                  <p className="font-semibold text-white">Write Review</p>
                  <p className="text-sm text-gray-400 mt-1">Share feedback on your latest shoot.</p>
                </Link>
                <Link to="/dashboard/account" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left transition hover:border-orange-500/40">
                  <p className="font-semibold text-white">Edit Profile</p>
                  <p className="text-sm text-gray-400 mt-1">Update your contact details.</p>
                </Link>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
              <h3 className="text-xl font-semibold">Account Summary</h3>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="font-semibold text-white">{user?.first_name} {user?.last_name}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold text-white">{user?.email}</p>
                </div>
                {summary.averageRating && (
                  <div className="rounded-2xl bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Studio Rating</p>
                    <p className="font-semibold text-white">{summary.averageRating} / 5</p>
                  </div>
                )}
              </div>
            </article>
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
