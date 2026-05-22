export const TIME_SLOTS = [
    { label: 'Morning (08:00 AM - 11:00 AM)', start: '08:00', end: '11:00' },
    { label: 'Midday (11:00 AM - 02:00 PM)', start: '11:00', end: '14:00' },
    { label: 'Afternoon (02:00 PM - 05:00 PM)', start: '14:00', end: '17:00' },
    { label: 'Evening (05:00 PM - 08:00 PM)', start: '17:00', end: '20:00' },
];

export const getTimeSlotValues = (label) => {
    const slot = TIME_SLOTS.find((s) => s.label === label);
    return slot ? { start: slot.start, end: slot.end } : null;
};

export const isSlotBooked = (slot, occupiedSlots = []) => {
    return occupiedSlots.some(
        (occupied) => occupied.start === slot.start && occupied.end === slot.end
    );
};