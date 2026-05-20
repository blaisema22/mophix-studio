export const getServiceAvailability = (serviceId) => {
  const availabilityMap = {
    1: [3, 6, 0],
    2: [2, 4, 6],
    3: [1, 5],
  };
  return availabilityMap[Number(serviceId)] ?? [2, 4, 6];
};

export const getMonthDates = (monthDate, serviceId) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availability = getServiceAvailability(serviceId);

  const dates = [];
  for (let index = 0; index < firstDayIndex; index += 1) {
    dates.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const available = availability.includes(date.getDay());
    dates.push({
      date,
      available,
      iso: date.toISOString().split('T')[0],
    });
  }

  return dates;
};