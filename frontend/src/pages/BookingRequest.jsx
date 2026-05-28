import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicesService, bookingsService } from '../services/api';
import { useAuthStore } from '../store';
import LoadingSpinner from '../components/LoadingSpinner'; // Keep this
import { formatPrice } from '../utils/format';
import { useAvailableDates } from '../hooks/useAvailableDates';
import { useSlotAvailability } from '../hooks/useSlotAvailability';
import { TIME_SLOTS, getTimeSlotValues, isSlotBooked } from '../utils/booking';

const BookingRequest = () => {
  // Calendar state used by this page
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [calendarItems, setCalendarItems] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');

  /**
   * Generates a 42-day calendar grid (6 weeks) for the given month.
   */
  const getMonthDates = (monthDate, availableISOs = []) => {
    const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    
    // Find the Sunday before or on the 1st
    const start = new Date(firstOfMonth);
    start.setDate(1 - start.getDay());

    const items = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      
      // Generate local ISO string (YYYY-MM-DD)
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      items.push({
        date: d,
        iso,
        available: availableISOs.includes(iso),
        isCurrentMonth: d.getMonth() === monthDate.getMonth(),
      });
    }
    return items;
  };

  const { serviceId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
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
  const [validationError, setValidationError] = useState(null); // New state for validation errors

  const { availableDates: availableEventDates, loading: loadingAvailableDates } = useAvailableDates(serviceId);
  const { occupiedSlots, allSlotsBooked, availableSlotsCount, loading: loadingSlots } = useSlotAvailability(formData.event_date);

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
    setSelectedCalendarDate('');
  }, [serviceId]);

  useEffect(() => {
    setCalendarItems(getMonthDates(calendarMonth, availableEventDates));
  }, [calendarMonth, availableEventDates]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setStatus('You must be signed in to submit a booking request.');
      return;
    }

    if (allSlotsBooked) {
      setStatus('Cannot submit: All slots for this date are fully booked.');
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        user_id: user.user_id,
        service_id: serviceId,
        ...formData,
        // The backend schema requires booking_date (requested shoot date in legacy systems)
        // We set it to event_date for compatibility if not otherwise specified
        booking_date: formData.event_date || new Date().toISOString().split('T')[0],
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
    <section className="container mx-auto px-4 py-12 text-white">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <h1 className="section-title">Book Your Session</h1>
          <p className="section-subtitle">Request a photography session for the selected service.</p>
          <div className="rounded-[1.75rem] border border-orange-500/20 bg-black-dark p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">{service?.name || 'Selected service'}</h2>
            <p className="text-white/70 mb-2">{service?.description || 'Please provide your event details.'}</p>
            <p className="text-primary font-semibold">Price: {formatPrice(service?.price)}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black-dark p-4 text-sm text-white/70">
              <p className="font-semibold text-white">Schedule note</p>
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
                {loadingAvailableDates ? (
                  <div className="col-span-7 py-6 text-center text-xs text-gray-500">Loading availability...</div>
                ) : (
                  calendarItems.map((item, index) => {
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
                        className={`h-10 rounded-xl text-sm transition-all ${
                          item.available 
                            ? 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30' 
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                        } ${isSelected ? 'ring-2 ring-orange-400 scale-110' : ''} ${!item.isCurrentMonth ? 'opacity-30' : ''}`}
                      >
                        {item.date.getDate()}
                      </button>
                    );
                  })
                )}
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
                <span className="text-sm font-medium text-gray-300">Preferred Event Date</span>
                <input className="input-field mt-2 bg-[#0b0b0b]" type="date" name="event_date" value={formData.event_date} onChange={handleChange} required />
                <span className="text-xs text-gray-500">Optional — or choose a date from the calendar above.</span>
              </label>
            </div>
            {loadingSlots && <p className="text-xs text-orange-400 animate-pulse">Checking slot availability...</p>}
            {!loadingSlots && formData.event_date && allSlotsBooked && (
              <p className="text-sm text-red-500">All slots are booked for this date. Please pick a different day.</p>
            )}
            {!loadingSlots && formData.event_date && !allSlotsBooked && availableSlotsCount > 0 && (
              <p className="text-sm text-emerald-500">{availableSlotsCount} slot(s) still available on this date.</p>
            )}
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-gray-300">Preferred Start Time</span>
                <input className="input-field mt-2 bg-[#0b0b0b]" type="time" name="preferred_time_start" value={formData.preferred_time_start} onChange={handleChange} />
                <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-300">Preferred End Time</span>
                <input className="input-field mt-2 bg-[#0b0b0b]" type="time" name="preferred_time_end" value={formData.preferred_time_end} onChange={handleChange} />
                <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Event Location</span>
              <input className="input-field mt-2 bg-[#0b0b0b]" type="text" name="event_location" placeholder="e.g. Kigali Convention Centre" value={formData.event_location} onChange={handleChange} required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Number of Participants</span>
              <input className="input-field mt-2 bg-[#0b0b0b]" type="number" name="number_of_participants" min="1" value={formData.number_of_participants} onChange={handleChange} required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Special Requests</span>
              <textarea className="input-field mt-2 h-40 bg-[#0b0b0b] resize-none" name="special_requests" placeholder="Any specific requirements..." value={formData.special_requests} onChange={handleChange} />
            </label>
            <button className="btn-secondary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={submitting || allSlotsBooked}>
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
            {status && <p className={`text-sm font-medium ${status.includes('successfully') ? 'text-emerald-400' : 'text-orange-400'}`}>{status}</p>}
            {validationError && <p className="text-sm text-red-500 mt-2">{validationError}</p>} {/* Display validation error */}
          </form>
        </div>

        <aside className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Need help?</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">Send us a message through the contact page and our team will help you finalize your booking.</p>
          <p className="text-orange-400 font-bold">Phone: <span className="text-white">+250 788 242290</span></p>
          <p className="text-orange-400 font-bold">Email: <span className="text-white">info@mophixstudio.rw</span></p>
        </aside>
      </div>
    </section>
    
  );
};

export default BookingRequest;
