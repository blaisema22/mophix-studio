import { useState, useEffect } from 'react';
import { bookingsService } from '../services/api';
import { TIME_SLOTS, isSlotBooked } from '../utils/booking';

export const useSlotAvailability = (eventDate) => {
    const [occupiedSlots, setOccupiedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOccupiedSlots = async() => {
            if (!eventDate) {
                setOccupiedSlots([]);
                return;
            }
            setLoading(true);
            try {
                const response = await bookingsService.getAll({ event_date: eventDate });
                const bookings = response.data || response || [];
                const occupied = bookings
                    .filter(b => b.status !== 'cancelled')
                    .map(b => ({
                        start: b.preferred_time_start,
                        end: b.preferred_time_end
                    }));
                setOccupiedSlots(occupied);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOccupiedSlots();
    }, [eventDate]);

    const allSlotsBooked = eventDate && !loading && TIME_SLOTS.every(slot => isSlotBooked(slot, occupiedSlots));

    return { occupiedSlots, allSlotsBooked, loading, error };
};