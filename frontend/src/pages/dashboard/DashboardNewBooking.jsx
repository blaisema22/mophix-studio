import { useEffect, useState } from 'react';
import { bookingsService, servicesService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

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

            <label className="block text-sm text-gray-300">
              Session Date
              <input type="date" name="event_date" value={form.event_date} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]" />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm text-gray-300">
              Preferred Start Time
              <input type="time" name="preferred_time_start" value={form.preferred_time_start} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]" />
            </label>
            <label className="block text-sm text-gray-300">
              Preferred End Time
              <input type="time" name="preferred_time_end" value={form.preferred_time_end} onChange={handleChange} required className="input-field mt-2 bg-[#0b0b0b]" />
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
