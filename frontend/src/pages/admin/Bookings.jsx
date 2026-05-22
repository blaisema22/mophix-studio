import React, { useEffect, useState } from 'react';
import { bookingsService } from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsService.getAll();
      setBookings(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await bookingsService.updateStatus(id, 'Confirmed');
      fetchBookings();
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="section-title">Manage Bookings</h1>
      <p className="section-subtitle">Approve, update, and review booking requests from clients.</p>

      <div className="table-card p-6 mt-8">
        {loading && <div className="p-4">Loading bookings...</div>}
        {error && <div className="p-4 text-red-400">Error: {error}</div>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.client_name || b.client || b.user_name || '—'}</td>
                  <td>{b.date || b.booking_date || '—'}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="btn-secondary mr-2">View</button>
                    {b.status !== 'Confirmed' && (
                      <button className="btn-primary" onClick={() => handleApprove(b.id)}>Approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminBookings;
