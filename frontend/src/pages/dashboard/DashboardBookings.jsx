import { useEffect, useState } from 'react';
import { bookingsService } from '../../services/api';
import { useAuthStore } from '../../store';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardBookings = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsService.getAll({ user_id: user?.user_id });
        setBookings(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">My Bookings</h1>
        <p className="section-subtitle">All of your scheduled photography sessions and booking status details.</p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const serviceName = booking.Service?.name || booking.service_name || `Booking #${booking.booking_id}`;
            const displayTime = booking.preferred_time_start || booking.preferred_time_end || 'TBD';

            return (
              <article key={booking.booking_id} className="card p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{serviceName}</h2>
                    <p className="text-gray-400">{booking.event_date} at {displayTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Status: <span className="font-semibold text-orange-300">{booking.status}</span></p>
                    <p className="text-sm text-gray-400">Payment: <span className="font-semibold">{booking.payment_status || 'unpaid'}</span></p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400">No bookings found. Start by booking a new session.</div>
      )}
    </div>
  );
};

export default DashboardBookings;
