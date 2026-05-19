import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicesService, bookingsService } from '../services/api';
import { useAuthStore } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/format';

const BookingRequest = () => {
  const { serviceId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    booking_date: '',
    event_date: '',
    preferred_time_start: '',
    preferred_time_end: '',
    event_location: '',
    number_of_participants: 1,
    special_requests: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesService.getById(serviceId);
        setService(response.data || response || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus('You must be signed in to submit a booking request.');
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        user_id: user.user_id,
        service_id: serviceId,
        booking_date: formData.booking_date,
        preferred_time_start: formData.preferred_time_start,
        preferred_time_end: formData.preferred_time_end,
        event_date: formData.event_date,
        event_location: formData.event_location,
        number_of_participants: Number(formData.number_of_participants),
        special_requests: formData.special_requests,
      };

      await bookingsService.create(payload);
      setStatus('Booking request submitted successfully.');
      setTimeout(() => navigate('/my-bookings'), 1200);
    } catch (error) {
      console.error(error);
      setStatus('Unable to submit booking request at this time.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <h1 className="section-title">Book Your Session</h1>
          <p className="section-subtitle">Request a photography session for the selected service.</p>
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">{service?.name || 'Selected service'}</h2>
            <p className="text-gray-700 mb-2">{service?.description || 'Please provide your event details.'}</p>
            <p className="text-primary font-semibold">Price: {formatPrice(service?.price)}</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Booking Date</span>
                <input className="input-field mt-2" type="date" name="booking_date" value={formData.booking_date} onChange={handleChange} required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Event Date</span>
                <input className="input-field mt-2" type="date" name="event_date" value={formData.event_date} onChange={handleChange} required />
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Start Time</span>
                <input className="input-field mt-2" type="time" name="preferred_time_start" value={formData.preferred_time_start} onChange={handleChange} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">End Time</span>
                <input className="input-field mt-2" type="time" name="preferred_time_end" value={formData.preferred_time_end} onChange={handleChange} />
              </label>
            </div>
            <input className="input-field" type="text" name="event_location" placeholder="Event location" value={formData.event_location} onChange={handleChange} required />
            <input className="input-field" type="number" name="number_of_participants" min="1" placeholder="Number of participants" value={formData.number_of_participants} onChange={handleChange} required />
            <textarea className="input-field h-40" name="special_requests" placeholder="Special requests" value={formData.special_requests} onChange={handleChange} />
            <button className="btn-secondary w-full" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
            {status && <p className="text-sm text-gray-700">{status}</p>}
          </form>
        </div>

        <aside className="card p-8 bg-neutral-50">
          <h2 className="text-xl font-semibold mb-4">Need help?</h2>
          <p className="text-gray-700 mb-4">Send us a message through the contact page and our team will help you finalize your booking.</p>
          <p className="font-semibold">Phone: +250 788 242290</p>
          <p className="font-semibold">Email: info@mophixstudio.rw</p>
        </aside>
      </div>
    </section>
  );
};

export default BookingRequest;
