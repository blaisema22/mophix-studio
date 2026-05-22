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
  const { serviceId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    // booking_date: '', // Removed as it will be set automatically
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
    if (availableEventDates.length > 0 && !formData.event_date) {
      setFormData(prev => ({ ...prev, event_date: availableEventDates[0].iso }));
    } else if (formData.event_date && !availableEventDates.some(d => d.iso === formData.event_date)) {
      setFormData(prev => ({ ...prev, event_date: '' }));
    }
  }, [availableEventDates, formData.event_date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSlotChange = (e) => {
    const values = getTimeSlotValues(e.target.value);
    if (values) {
      setFormData({
        ...formData,
        preferred_time_start: values.start,
        preferred_time_end: values.end,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatus('You must be signed in to submit a booking request.');
      return;
    }
    setValidationError(null); // Clear previous validation errors

    // Prevent submission if all slots are booked or the specific selected slot is occupied
    if (allSlotsBooked) {
      setValidationError('All time slots for this date are fully booked. Please select another date.');
      return;
    }

    const isSelectedSlotOccupied = occupiedSlots.some(
      (slot) => slot.start === formData.preferred_time_start && slot.end === formData.preferred_time_end
    );
    if (isSelectedSlotOccupied) {
      setValidationError('The selected time slot is already booked. Please choose another one.');
      return;
    }

    // Client-side validation: Ensure event_date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedEventDate = new Date(formData.event_date);
    if (selectedEventDate < today) {
      setValidationError('The preferred event date cannot be in the past.');
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        user_id: user.user_id,
        service_id: serviceId,
        booking_date: new Date().toISOString().split('T')[0], // Automatically set to current date
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
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Preferred Event Date</span>
                  {loadingAvailableDates && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
                  )}
                </div>
                <select
                  className="input-field mt-2"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  disabled={loadingAvailableDates} // Disable while loading
                >
                  {loadingAvailableDates ? (
                    <option value="">Loading available dates...</option>
                  ) : (
                    <>
                      <option value="">Select a date</option>
                      {availableEventDates.map((dateItem) => (
                        <option key={dateItem.iso} value={dateItem.iso}>
                          {new Date(dateItem.iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          {dateItem.isLimited ? ' (Limited Availability)' : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <span className="text-xs text-gray-500">Select your preferred date from available options. Staff will confirm the final date.</span>
              </label>
            </div>
            <label className="block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Preferred Time Slot</span>
                {loadingSlots && <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />}
              </div>
              <select
                onChange={handleTimeSlotChange}
                className="input-field mt-2"
                required
                disabled={loadingSlots || !formData.event_date}
              >
                <option value="">{loadingSlots ? 'Checking availability...' : 'Select a time slot'}</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.label} value={slot.label} disabled={isSlotBooked(slot, occupiedSlots)}>
                    {slot.label} {isSlotBooked(slot, occupiedSlots) ? '(Fully Booked)' : ''}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500">Staff will verify availability for the selected slot.</span>
              {allSlotsBooked && (
                <p className="text-sm text-orange-500 mt-2 font-medium">⚠️ All time slots for this date are fully booked. Please select another date.</p>
              )}
              {formData.event_date && !loadingSlots && !allSlotsBooked && availableSlotsCount === 1 && (
                <p className="text-xs text-orange-400 font-medium mt-1">⚠️ Only 1 slot remaining for this date!</p>
              )}
            </label>
            <input className="input-field" type="text" name="event_location" placeholder="Event location" value={formData.event_location} onChange={handleChange} required />
            <input className="input-field" type="number" name="number_of_participants" min="1" placeholder="Number of participants" value={formData.number_of_participants} onChange={handleChange} required />
            <textarea className="input-field h-40" name="special_requests" placeholder="Special requests" value={formData.special_requests} onChange={handleChange} />
            <button className="btn-secondary w-full" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
            {status && <p className="text-sm text-gray-700">{status}</p>}
            {validationError && <p className="text-sm text-red-500 mt-2">{validationError}</p>} {/* Display validation error */}
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
