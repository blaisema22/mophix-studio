import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { testimonialsService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardSubmittedReviews = () => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      try {
        const response = await testimonialsService.getUserTestimonials({ limit: 50 });
        setReviews(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load your submitted reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">My Submitted Reviews</h1>
        <p className="section-subtitle">Track the status of the feedback you’ve shared with our studio team.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-rose-300">{error}</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const serviceName = review.Booking?.Service?.name || `Booking #${review.booking_id}`;
            return (
              <article key={review.testimonial_id} className="rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-6 shadow-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{serviceName}</h2>
                    <p className="text-gray-400">{new Date(review.created_at).toLocaleDateString()} — {review.rating} star{review.rating > 1 ? 's' : ''}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${review.is_approved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-orange-500/10 text-orange-300'}`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400">No reviews submitted yet.</div>
      )}
    </div>
  );
};

export default DashboardSubmittedReviews;
