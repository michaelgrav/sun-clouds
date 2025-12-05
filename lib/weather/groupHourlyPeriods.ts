import { Period } from '../../types/weather';

const isSameLocalDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export interface GroupedPeriods {
  label: string;
  periods: Period[];
}

export const groupHourlyPeriodsByDay = (
  periods: Period[] = [],
  maxHours = 48,
  today = new Date()
): GroupedPeriods[] => {
  const windowed = periods.slice(0, maxHours);
  if (!windowed.length) {
    return [];
  }

  const groups: GroupedPeriods[] = [];

  windowed.forEach((period) => {
    const start = new Date(period.startTime);
    const label = isSameLocalDay(start, today)
      ? 'Today'
      : start.toLocaleDateString([], { weekday: 'long' });

    const existing = groups.find((group) => group.label === label);
    if (existing) {
      existing.periods.push(period);
    } else {
      groups.push({ label, periods: [period] });
    }
  });

  return groups;
};
