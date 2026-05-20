import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicesService, bookingsService } from '../services/api';
import { useAuthStore } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/format';
import { getMonthDates } from '../utils/calendar';

const BookingRequest = () => {
  const { serviceId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');
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

  useEffect(() => {
    if (!serviceId) {
      setAvailableDates([]);
      setSelectedCalendarDate('');
      return;
    }
    setAvailableDates(getMonthDates(calendarMonth, serviceId));
  }, [serviceId, calendarMonth]);

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
            <div className="mt-4 rounded-xl border border-gray-200/30 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Schedule note</p>
              <p>The staff will confirm the exact session date and available time once your service request is received.</p>
              {service?.duration_hours ? (
                <p>Estimated session length: {service.duration_hours} hour{service.duration_hours > 1 ? 's' : ''}.</p>
              ) : null}
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-4">
              <div className="flex items-center justify-between mb-3 text-sm text-gray-300">
                <span>{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/5">Prev</button>
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/5">Next</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {availableDates.map((item, index) => {
                  if (!item) {
                    return <div key={`empty-${index}`} className="h-10 rounded-xl bg-white/5" />;
                  }
                  const isSelected = item.iso === selectedCalendarDate;
                  return (
                    <button
                      type="button"
                      key={item.iso}
                      onClick={() => item.available && setSelectedCalendarDate(item.iso)}
                      disabled={!item.available}
                      className={`h-10 rounded-xl text-sm ${item.available ? 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30' : 'bg-white/5 text-gray-500 cursor-not-allowed'} ${isSelected ? 'ring-2 ring-orange-400' : ''}`}
                    >
                      {item.date.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs text-gray-400">Selected date</p>
                  <p className="text-sm text-white">{selectedCalendarDate || 'None selected'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => selectedCalendarDate && setFormData({ ...formData, event_date: selectedCalendarDate })}
                  disabled={!selectedCalendarDate}
                  className="btn-secondary inline-flex items-center justify-center rounded-xl px-4 py-2 disabled:opacity-50"
                >
                  Set date
                </button>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Booking Date</span>
                <input className="input-field mt-2" type="date" name="booking_date" value={formData.booking_date} onChange={handleChange} required />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Preferred Event Date</span>
                <input className="input-field mt-2" type="date" name="event_date" value={formData.event_date} onChange={handleChange} />
                <span className="text-xs text-gray-500">Optional — or choose a date from the calendar above.</span>
              </label>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Preferred Start Time</span>
                <input className="input-field mt-2" type="time" name="preferred_time_start" value={formData.preferred_time_start} onChange={handleChange} />
                <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Preferred End Time</span>
                <input className="input-field mt-2" type="time" name="preferred_time_end" value={formData.preferred_time_end} onChange={handleChange} />
                <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
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
