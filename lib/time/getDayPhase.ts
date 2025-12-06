export type DayPhase = 'Day' | 'Night';

export const getDayPhase = (iso?: string | null): DayPhase | null => {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? 'Day' : 'Night';
};
