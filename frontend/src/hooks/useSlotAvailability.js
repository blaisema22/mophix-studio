import { useState, useEffect } from 'react';
import { bookingsService } from '../services/api';

export function useSlotAvailability(eventDate) {
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventDate) {
      setOccupiedSlots([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    bookingsService
      .getOccupiedSlots(eventDate)
      .then((res) => {
        if (!cancelled) setOccupiedSlots(res.data || res || []);
      })
      .catch((err) => {
        console.error('Failed to fetch slot availability', err);
        if (!cancelled) setOccupiedSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventDate]);

  const allSlotsBooked = occupiedSlots.length > 0 && occupiedSlots.every((s) => s.fullyBooked);
  const availableSlotsCount = occupiedSlots.filter((s) => !s.fullyBooked).length;

  return { occupiedSlots, allSlotsBooked, availableSlotsCount, loading };
}