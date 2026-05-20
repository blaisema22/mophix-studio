import { useEffect, useState } from 'react';
import { bookingsService, servicesService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getMonthDates } from '../../utils/calendar';

const DashboardNewBooking = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');
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

  const selectedService = services.find((service) => String(service.service_id) === String(form.service_id));

  useEffect(() => {
    if (!form.service_id) {
      setAvailableDates([]);
      setSelectedCalendarDate('');
      return;
    }
    setAvailableDates(getMonthDates(calendarMonth, form.service_id));
  }, [form.service_id, calendarMonth]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

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

            {selectedService && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-orange-500/20 bg-[#0c0c0c] p-4 text-sm text-gray-300">
                  <p className="font-semibold text-white">Service schedule note</p>
                  <p>The staff will confirm the exact session date and available start/end time after reviewing the selected service.</p>
                  {selectedService.duration_hours ? (
                    <p>Estimated session length: {selectedService.duration_hours} hour{selectedService.duration_hours > 1 ? 's' : ''}.</p>
                  ) : null}
                </div>

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
                  <div className="mt-4 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Selected date</p>
                      <p className="text-sm text-white">{selectedCalendarDate || 'None selected'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectedCalendarDate && setForm({ ...form, event_date: selectedCalendarDate })}
                      disabled={!selectedCalendarDate}
                      className="btn-primary px-4 py-2 disabled:opacity-50"
                    >
                      Set date
                    </button>
                  </div>
                </div>
              </div>
            )}

            <label className="block text-sm text-gray-300">
              Session Date
              <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm text-gray-300">
              Preferred Start Time
              <input type="time" name="preferred_time_start" value={form.preferred_time_start} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
              <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
            </label>
            <label className="block text-sm text-gray-300">
              Preferred End Time
              <input type="time" name="preferred_time_end" value={form.preferred_time_end} onChange={handleChange} className="input-field mt-2 bg-[#0b0b0b]" />
              <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
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
