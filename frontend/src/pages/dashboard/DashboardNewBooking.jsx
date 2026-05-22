import { useEffect, useState } from 'react';
import { bookingsService, servicesService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAvailableDates } from '../../hooks/useAvailableDates';

import { useSlotAvailability } from '../../hooks/useSlotAvailability';
import { TIME_SLOTS, getTimeSlotValues, isSlotBooked } from '../../utils/booking';

const DashboardNewBooking = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    service_id: '',
    event_date: '',
    preferred_time_start: '',
    preferred_time_end: '',
    event_location: '',
    number_of_participants: 1,
    special_requests: '',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { availableDates: availableEventDates, loading: loadingAvailableDates } = useAvailableDates(form.service_id);
  const { occupiedSlots, allSlotsBooked, availableSlotsCount, loading: loadingSlots } = useSlotAvailability(form.event_date);

  const selectedService = services.find((service) => String(service.service_id) === String(form.service_id));

  useEffect(() => {
    if (availableEventDates.length > 0 && !form.event_date) {
      setForm(prev => ({ ...prev, event_date: availableEventDates[0].iso }));
    }
  }, [availableEventDates, form.event_date]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await servicesService.getAll();
        setServices(response.data || response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleTimeSlotChange = (e) => {
    const values = getTimeSlotValues(e.target.value);
    if (values) {
      setForm({
        ...form,
        preferred_time_start: values.start,
        preferred_time_end: values.end
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    // Prevent submission if all slots are booked or the specific selected slot is occupied
    if (allSlotsBooked) {
      setError('No slots available for this date. Please choose a different date.');
      return;
    }

    const isSelectedSlotOccupied = occupiedSlots.some(
      (slot) => slot.start === form.preferred_time_start && slot.end === form.preferred_time_end
    );
    if (isSelectedSlotOccupied) {
      setError('The selected time slot is already booked. Please choose another one.');
      return;
    }

    // Client-side validation: Ensure event_date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedEventDate = new Date(form.event_date);
    if (selectedEventDate < today) {
      setError('The preferred event date cannot be in the past.');
      return;
    }

    try {
      const payload = {
        service_id: form.service_id,
        event_date: form.event_date,
        event_location: form.event_location,
        number_of_participants: form.number_of_participants,
        preferred_time_start: form.preferred_time_start,
        preferred_time_end: form.preferred_time_end,
        special_requests: form.special_requests,
      };

      await bookingsService.create(payload);
      setStatus('Your booking request has been submitted successfully. We will confirm availability shortly.');
      setForm({
        service_id: '',
        event_date: '',
        preferred_time_start: '',
        preferred_time_end: '',
        event_location: '',
        number_of_participants: 1,
        special_requests: '',
      });
    } catch (submitError) {
      console.error(submitError);
      setError(submitError?.message || 'Unable to submit booking request. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Book a New Session</h1>
        <p className="section-subtitle">Select your preferred service, date, time and send your session request.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm text-gray-300">
              Service Type
              <select name="service_id" value={form.service_id} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]">
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>{service.name}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span>Preferred Session Date</span>
                {loadingAvailableDates && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-orange-500" />
                )}
              </div>
              <select
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
                disabled={loadingAvailableDates || !form.service_id}
                className="input-field mt-2 bg-[#0b0b0b]"
              >
                {loadingAvailableDates ? (
                  <option value="">Loading available dates...</option>
                ) : !form.service_id ? (
                  <option value="">Choose a service first</option>
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
              <span className="text-xs text-gray-500">Select an available date. Staff will confirm final availability.</span>
            </label>
          </div>

          {selectedService && (
            <div className="rounded-2xl border border-orange-500/20 bg-[#0c0c0c] p-4 text-sm text-gray-300">
              <p className="font-semibold text-white">Service schedule note</p>
              <p>The staff will confirm the exact session date and available start/end time after reviewing the selected service.</p>
              {selectedService.duration_hours ? (
                <p>Estimated session length: {selectedService.duration_hours} hour{selectedService.duration_hours > 1 ? 's' : ''}.</p>
              ) : null}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-1">
            <label className="block text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span>Preferred Time Slot</span>
                {loadingSlots && <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-orange-500" />}
              </div>
              <select 
                onChange={handleTimeSlotChange} 
                className="input-field mt-2 bg-[#0b0b0b]"
                required
                disabled={loadingSlots || !form.event_date}
              >
                <option value="">{loadingSlots ? 'Checking availability...' : 'Select a time slot'}</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.label} value={slot.label} disabled={isSlotBooked(slot, occupiedSlots)}>
                    {slot.label} {isSlotBooked(slot, occupiedSlots) ? '(Booked)' : ''}
                  </option>
                ))}
              </select>
              <span className="text-xs text-gray-500">The staff will verify availability for the selected slot.</span>
              {allSlotsBooked && (
                <p className="text-sm text-orange-500 mt-2 font-medium">⚠️ No slots available for this date. Please choose a different date.</p>
              )}
              {form.event_date && !loadingSlots && !allSlotsBooked && availableSlotsCount === 1 && (
                <p className="text-xs text-orange-400 font-medium mt-1">⚠️ Only 1 slot remaining for this date!</p>
              )}
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm text-gray-300">
              Location
              <input type="text" name="event_location" value={form.event_location} onChange={handleChange} placeholder="Session location" required className="input-field mt-2 bg-[#0b0b0b]" />
            </label>
            <label className="block text-sm text-gray-300">
              Number of Participants
              <input type="number" min="1" name="number_of_participants" value={form.number_of_participants} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
            </label>
          </div>

          <label className="block text-sm text-gray-300">
            Additional Notes
            <textarea name="special_requests" value={form.special_requests} onChange={handleChange} placeholder="Add any special requests" className="input-field mt-2 min-h-[120px] bg-[#0b0b0b]" />
          </label>

          <button type="submit" className="btn-primary w-full">Submit Request</button>
          {status && <p className="text-sm text-emerald-300">{status}</p>}
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default DashboardNewBooking;
