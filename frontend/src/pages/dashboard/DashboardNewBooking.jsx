import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingsService, servicesService } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Panel from '../../components/Panel';
import { getMonthDates } from '../../utils/calendar';
import { useAvailableDates } from '../../hooks/useAvailableDates';
import { useSlotAvailability } from '../../hooks/useSlotAvailability';
import { formatPrice } from '../../utils/format';

const DashboardNewBooking = () => {
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get('serviceId');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    service_id: serviceIdParam || '',
    event_date: '',
    preferred_time_start: '',
    preferred_time_end: '',
    event_location: '',
    number_of_participants: 1,
    special_requests: '',
  });

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('');

  const { availableDates: availableEventDates, loading: loadingAvailableDates } =
    useAvailableDates(form.service_id);
  const { allSlotsBooked, availableSlotsCount, loading: loadingSlots } =
    useSlotAvailability(form.event_date);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await servicesService.getAll();
        setServices(res.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectFromComparison = (id) => {
    setForm((prev) => ({ ...prev, service_id: id }));
    setIsComparisonOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      await bookingsService.create(form);
      setStatus('Booking request submitted successfully.');
    } catch (err) {
      setError(err.message || 'Unable to submit booking request.');
    }
  };

  const selectedService = services.find((s) => String(s.service_id) === String(form.service_id));
  const calendarDates = getMonthDates(calendarMonth, availableEventDates);

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Book a New Session</h1>
        <p className="section-subtitle">Request a photography session for the selected service.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* ---- Compare packages button ---- */}
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => setIsComparisonOpen(true)}
              className="btn-outline text-sm"
            >
              Compare Packages
            </button>
          </div>

          {/* ---- Main booking form ---- */}
          <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-orange-500/20 bg-[#141414] p-8 shadow-xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Service selector */}
              <label className="block text-sm text-gray-300">
                Service Type
                <select
                  name="service_id"
                  value={form.service_id}
                  onChange={handleChange}
                  required
                  className="input-field mt-2 bg-[#0b0b0b]"
                >
                  <option value="">Choose a service</option>
                  {services.map((service) => (
                    <option key={service.service_id} value={service.service_id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Calendar — only shown once a service is selected */}
              {selectedService && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-orange-500/20 bg-[#0c0c0c] p-4 text-sm text-gray-300">
                    <p className="font-semibold text-white">Service schedule note</p>
                    <p>The staff will confirm the exact session date and available start/end time after reviewing the selected service.</p>
                    {selectedService.duration_hours ? (
                      <p>
                        Estimated session length: {selectedService.duration_hours} hour
                        {selectedService.duration_hours > 1 ? 's' : ''}.
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-4">
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-300">
                      <span>{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/5"
                        >
                          Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300 hover:bg-white/5"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-1">{day}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 mt-2">
                      {loadingAvailableDates ? (
                        <div className="col-span-7 py-6 text-center text-xs text-gray-500">Loading dates…</div>
                      ) : (
                        calendarDates.map((item, index) => {
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
                              className={`h-10 rounded-xl text-sm ${
                                item.available
                                  ? 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30'
                                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
                              } ${isSelected ? 'ring-2 ring-orange-400' : ''}`}
                            >
                              {item.date.getDate()}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Selected date</p>
                        <p className="text-sm text-white">{selectedCalendarDate || 'None selected'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectedCalendarDate && setForm((prev) => ({ ...prev, event_date: selectedCalendarDate }))}
                        disabled={!selectedCalendarDate}
                        className="btn-primary px-4 py-2 disabled:opacity-50"
                      >
                        Set date
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual date input */}
              <label className="block text-sm text-gray-300">
                Session Date
                <input
                  type="date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="input-field mt-2 bg-[#0b0b0b]"
                />
              </label>
            </div>

            {/* Time inputs */}
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block text-sm text-gray-300">
                Preferred Start Time
                <input
                  type="time"
                  name="preferred_time_start"
                  value={form.preferred_time_start}
                  onChange={handleChange}
                  className="input-field mt-2 bg-[#0b0b0b]"
                />
                <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
              </label>
              <label className="block text-sm text-gray-300">
                Preferred End Time
                <input
                  type="time"
                  name="preferred_time_end"
                  value={form.preferred_time_end}
                  onChange={handleChange}
                  className="input-field mt-2 bg-[#0b0b0b]"
                />
                <span className="text-xs text-gray-500">Optional — staff will confirm the final time.</span>
              </label>
            </div>

            {/* Slot availability warning */}
            {loadingSlots && (
              <p className="text-xs text-gray-500">Checking slot availability…</p>
            )}
            {!loadingSlots && form.event_date && allSlotsBooked && (
              <p className="text-sm text-red-400">All slots are booked for this date. Please pick a different day.</p>
            )}
            {!loadingSlots && form.event_date && !allSlotsBooked && availableSlotsCount > 0 && (
              <p className="text-sm text-emerald-400">{availableSlotsCount} slot(s) still available on this date.</p>
            )}

            {/* Location */}
            <label className="block text-sm text-gray-300">
              Event Location
              <input
                type="text"
                name="event_location"
                value={form.event_location}
                onChange={handleChange}
                placeholder="e.g. Kigali Convention Centre"
                className="input-field mt-2 bg-[#0b0b0b]"
              />
            </label>

            {/* Participants */}
            <label className="block text-sm text-gray-300">
              Number of Participants
              <input
                type="number"
                name="number_of_participants"
                value={form.number_of_participants}
                min={1}
                onChange={handleChange}
                className="input-field mt-2 bg-[#0b0b0b]"
              />
            </label>

            {/* Special requests */}
            <label className="block text-sm text-gray-300">
              Special Requests
              <textarea
                name="special_requests"
                value={form.special_requests}
                onChange={handleChange}
                rows={4}
                placeholder="Any special instructions or requirements…"
                className="input-field mt-2 bg-[#0b0b0b] resize-none"
              />
            </label>

            {/* Feedback */}
            {error && <p className="text-sm text-red-400">{error}</p>}
            {status && <p className="text-sm text-emerald-400">{status}</p>}

            <button
              type="submit"
              disabled={loadingSlots || allSlotsBooked}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Booking Request
            </button>
          </form>

          {/* ---- Package comparison modal ---- */}
          {isComparisonOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl border border-orange-500/20 bg-black shadow-2xl overflow-hidden">
                {/* Modal header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                  <h2 className="text-lg font-semibold text-white">Compare Packages</h2>
                  <button
                    type="button"
                    onClick={() => setIsComparisonOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close comparison"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable table */}
                <div className="flex-1 overflow-auto p-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-20 bg-black py-4 pr-6 text-sm font-semibold text-orange-400 uppercase tracking-widest border-b border-white/5">
                          Features
                        </th>
                        {services.map((s) => (
                          <th key={s.service_id} className="py-4 px-6 text-center border-b border-white/5 min-w-[200px]">
                            <div className="text-white font-bold text-lg">{s.name}</div>
                            <div className="text-[10px] text-white/50 uppercase mt-1">{s.category}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="group hover:bg-white/[0.02] transition-colors">
                        <td className="sticky left-0 z-10 bg-black py-5 pr-6 text-sm text-white/50 group-hover:text-white">Price</td>
                        {services.map((s) => (
                          <td key={s.service_id} className="py-5 px-6 text-center font-bold text-orange-400 text-lg">
                            {s.price ? `RWF ${formatPrice(s.price)}` : '—'}
                          </td>
                        ))}
                      </tr>
                      <tr className="group hover:bg-white/[0.02] transition-colors">
                        <td className="sticky left-0 z-10 bg-black py-5 pr-6 text-sm text-white/50 group-hover:text-white">Duration</td>
                        {services.map((s) => (
                          <td key={s.service_id} className="py-5 px-6 text-center text-white/70">
                            {s.duration_hours ? `${s.duration_hours} Hours` : 'Flexible'}
                          </td>
                        ))}
                      </tr>
                      <tr className="group hover:bg-white/[0.02] transition-colors">
                        <td className="sticky left-0 z-10 bg-black py-5 pr-6 text-sm text-white/50 group-hover:text-white">Photos Included</td>
                        {services.map((s) => (
                          <td key={s.service_id} className="py-5 px-6 text-center text-white/70">
                            {s.includes_photos_count || '—'}
                          </td>
                        ))}
                      </tr>
                      <tr className="group hover:bg-white/[0.02] transition-colors">
                        <td className="sticky left-0 z-10 bg-black py-5 pr-6 text-sm text-white/50 group-hover:text-white">Premium Album</td>
                        {services.map((s) => (
                          <td key={s.service_id} className="py-5 px-6 text-center">
                            {s.includes_album ? (
                              <span className="text-emerald-400 text-xl">✓</span>
                            ) : (
                              <span className="text-white/10">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="group hover:bg-white/[0.02] transition-colors">
                        <td className="sticky left-0 z-10 bg-black py-5 pr-6 text-sm text-white/50 group-hover:text-white">Physical Prints</td>
                        {services.map((s) => (
                          <td key={s.service_id} className="py-5 px-6 text-center">
                            {s.includes_prints ? (
                              <span className="text-emerald-400 text-xl">✓</span>
                            ) : (
                              <span className="text-white/10">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      {/* Select row */}
                      <tr>
                        <td className="sticky left-0 z-10 bg-black py-8 pr-6 border-t border-white/10" />
                        {services.map((s) => (
                          <td key={s.service_id} className="py-8 px-6 text-center border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => handleSelectFromComparison(s.service_id)}
                              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                String(form.service_id) === String(s.service_id)
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-orange-400 text-black hover:bg-orange-500'
                              }`}
                            >
                              {String(form.service_id) === String(s.service_id) ? 'Selected' : 'Select Package'}
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardNewBooking;