import { useState, useEffect } from 'react';
import { getMonthDates } from '../utils/calendar';
import { bookingsService } from '../services/api';
import { TIME_SLOTS } from '../utils/booking';

export const useAvailableDates = (serviceId, monthsToFetch = 6) => {
    const [availableDates, setAvailableDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!serviceId) {
            setAvailableDates([]);
            setLoading(false);
            return;
        }

        const fetchDates = async() => {
            setLoading(true);
            setError(null);
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const datesForDropdown = [];
                for (let i = 0; i < monthsToFetch; i++) {
                    const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
                    const monthDates = getMonthDates(monthDate, serviceId);
                    monthDates.forEach(item => {
                        if (item && item.available && new Date(item.iso) >= today) {
                            datesForDropdown.push(item);
                        }
                    });
                }

                // Fetch occupancy for the generated dates to determine "Limited Availability"
                const response = await bookingsService.getAll({ service_id: serviceId, status: 'confirmed,pending' });
                const allBookings = response.data || response || [];

                const datesWithAvailability = datesForDropdown.map(item => {
                    const dayBookings = allBookings.filter(b => b.event_date === item.iso);
                    const isLimited = (TIME_SLOTS.length - dayBookings.length) === 1;
                    return {...item, isLimited };
                });

                setAvailableDates(datesWithAvailability);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDates();
    }, [serviceId, monthsToFetch]);

    return { availableDates, loading, error };
};