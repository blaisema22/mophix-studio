import { useEffect, useState } from 'react';
import { bookingsService } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const DashboardBookingHistory = () => {
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await bookingsService.getAll({ user_id: user?.user_id });
        const items = response.data || response || [];
        setHistory(items.filter((booking) => booking.status === 'completed' || booking.status === 'cancelled'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadHistory();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Booking History</h1>
        <p className="section-subtitle">Your completed and cancelled sessions with links to photo galleries.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((booking) => {
            const serviceName = booking.Service?.name || booking.service_name || `Booking #${booking.booking_id}`;
            return (
              <article key={booking.booking_id} className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{serviceName}</h2>
                    <p className="text-gray-400">{booking.event_date} — {booking.status}</p>
                  </div>
                  <div className="text-right">
                    {booking.status === 'completed' ? (
                      <Link to="/dashboard/galleries/view" className="btn-outline text-sm">View Gallery</Link>
                    ) : (
                      <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-sm text-gray-300">No gallery available</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400">No booking history available yet.</div>
      )}
    </div>
  );
};

export default DashboardBookingHistory;
