import { Period } from '../../types/weather';

const ONE_HOUR_MS = 60 * 60 * 1000;

const parseDate = (value?: string): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Return only periods that have not finished yet, using the API-provided time zone
// information baked into the ISO strings. Falls back to a one-hour window when
// an explicit endTime is missing.
export const filterActivePeriods = (periods: Period[] = [], now: Date = new Date()): Period[] => {
  const currentMs = now.getTime();

  return periods
    .map((period) => {
      const start = parseDate(period.startTime);
      if (!start) {
        return null;
      }

      const end = parseDate(period.endTime) ?? new Date(start.getTime() + ONE_HOUR_MS);

      return {
        period,
        startMs: start.getTime(),
        endMs: end.getTime(),
      };
    })
    .filter(
      (entry): entry is { period: Period; startMs: number; endMs: number } =>
        entry != null && entry.endMs >= currentMs
    )
    .sort((a, b) => a.startMs - b.startMs)
    .map((entry) => entry.period);
};
