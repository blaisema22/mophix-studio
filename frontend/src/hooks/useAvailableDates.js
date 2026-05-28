import { useState, useEffect } from 'react';
import { servicesService } from '../services/api';

export function useAvailableDates(serviceId) {
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId) {
      setAvailableDates([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    servicesService
      .getAvailableDates(serviceId)
      .then((res) => {
        if (!cancelled) setAvailableDates(res.data || res || []);
      })
      .catch((err) => {
        console.error('Failed to fetch available dates', err);
        if (!cancelled) setAvailableDates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  return { availableDates, loading };
}