import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { bookingsService, testimonialsService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Panel from '../../components/Panel';

const DashboardWriteReview = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ booking_id: '', rating: 0, title: '', content: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;

      try {
        const response = await bookingsService.getAll({ user_id: user.user_id, status: 'completed', limit: 50 });
        setBookings(response.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.name === 'rating' ? Number(e.target.value) : e.target.value;
    setReview({ ...review, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    if (!review.booking_id || !review.rating || !review.title || !review.content) {
      setError('Please complete all fields before submitting your review.');
      return;
    }

    try {
      await testimonialsService.create(review);
      setStatus('Thank you! Your review has been submitted and is awaiting approval.');
      setReview({ booking_id: '', rating: 0, title: '', content: '' });
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Unable to submit review.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Write a Review</h1>
        <p className="section-subtitle">Tell us how your recent session went so we can keep improving.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Panel as="form" onSubmit={handleSubmit} className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-gray-400">You have no completed sessions available to review yet.</div>
          ) : (
            <>
              <label className="block text-sm text-gray-300">
                Session
                <select name="booking_id" value={review.booking_id} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]">
                  <option value="">Select a completed session</option>
                  {bookings.map((booking) => (
                    <option key={booking.booking_id} value={booking.booking_id}>
                      {booking.Service?.name || `Booking #${booking.booking_id}`} — {new Date(booking.event_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm text-gray-300">
                Review title
                <input type="text" name="title" value={review.title} onChange={handleChange} required placeholder="Short review title" className="input-field mt-2 bg-[#0b0b0b]" />
              </label>

              <label className="block text-sm text-gray-300">
                Rating
                <select name="rating" value={review.rating} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]">
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>{star} star{star > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm text-gray-300">
                Review
                <textarea name="content" value={review.content} onChange={handleChange} rows={6} required placeholder="Share your experience" className="input-field mt-2 bg-[#0b0b0b]" />
              </label>

              <button type="submit" className="btn-primary">Submit Review</button>
              {status && <p className="text-sm text-emerald-300">{status}</p>}
              {error && <p className="text-sm text-rose-300">{error}</p>}
            </>
          )}
        </Panel>
      )}
    </div>
  );
};

export default DashboardWriteReview;
