import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { bookingsService, testimonialsService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardTestimonials = () => {
  const { user } = useAuthStore();
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ booking_id: '', title: '', rating: 0, content: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      try {
        const response = await bookingsService.getAll({ user_id: user.user_id, status: 'completed', limit: 50 });
        setCompletedBookings(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to fetch completed sessions.');
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
      setReview({ booking_id: '', title: '', rating: 0, content: '' });
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Unable to submit review.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Testimonials</h1>
        <p className="section-subtitle">Share your experience, and help others choose the right photography package.</p>
      </div>

      <div className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-400/80">Leave a review</p>
          <h2 className="text-2xl font-semibold">How was your last session?</h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : completedBookings.length === 0 ? (
          <div className="text-gray-400">No completed sessions available to review yet. Complete a booking first.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-gray-300">
              Session
              <select name="booking_id" value={review.booking_id} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]">
                <option value="">Select a completed session</option>
                {completedBookings.map((booking) => (
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
          </form>
        )}
      </div>
    </div>
  );
};

export default DashboardTestimonials;
