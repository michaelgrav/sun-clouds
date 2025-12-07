import { Period } from '../../types/weather';

const HOUR_MS = 60 * 60 * 1000;

const isSameLocalDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const formatLocalISOString = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export interface GroupedPeriods {
  label: string;
  periods: Period[];
}

export const groupHourlyPeriodsByDay = (
  periods: Period[] = [],
  maxHours = 48,
  today = new Date()
): GroupedPeriods[] => {
  const baseCutoffMs = today.getTime() + maxHours * HOUR_MS;
  const cutoffDate = new Date(baseCutoffMs);
  cutoffDate.setHours(23, 59, 59, 999);
  const cutoffMs = cutoffDate.getTime();

  // Keep all periods that fall within the requested window, then extend to the
  // end of the last day touched so we do not drop the tail of that day.
  const windowed = periods
    .map((period) => {
      const start = new Date(period.startTime);
      return { start, period };
    })
    .filter(({ start }) => start.getTime() <= cutoffMs)
    .map(({ start, period }) => ({
      ...period,
      startTime: formatLocalISOString(start),
    }));

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
