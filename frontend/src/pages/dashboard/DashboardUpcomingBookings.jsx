import { useEffect, useState } from 'react';
import { bookingsService } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardUpcomingBookings = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingsService.getAll({ user_id: user?.user_id });
        const items = response.data || response || [];
        setBookings(items.filter((booking) => booking.status !== 'completed' && booking.status !== 'cancelled'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadBookings();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Upcoming Bookings</h1>
        <p className="section-subtitle">Review all confirmed and pending sessions that are scheduled next.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const serviceName = booking.Service?.name || booking.service_name || `Booking #${booking.booking_id}`;
            const displayTime = booking.preferred_time_start || booking.preferred_time_end || 'TBD';

            return (
              <article key={booking.booking_id} className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{serviceName}</h2>
                    <p className="text-gray-400">{booking.event_date} at {displayTime}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-orange-500/10 text-orange-300'}`}>
                      {booking.status}
                    </span>
                    {booking.status === 'pending' && <button className="btn-outline text-sm">Cancel</button>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400">No upcoming bookings found. Book a new session to get started.</div>
      )}
    </div>
  );
};

export default DashboardUpcomingBookings;
