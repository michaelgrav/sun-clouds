import { afterEach, describe, expect, it, vi } from 'vitest';
import { groupHourlyPeriodsByDay } from './groupHourlyPeriods';

const baseDate = new Date(2024, 0, 1, 0, 0, 0); // local midnight Jan 1 2024

const periods = [
  { startTime: new Date(2024, 0, 1, 12, 0, 0).toISOString() },
  { startTime: new Date(2024, 0, 2, 12, 0, 0).toISOString() },
  { startTime: new Date(2024, 0, 2, 18, 0, 0).toISOString() },
];

describe('groupHourlyPeriodsByDay', () => {
  it('groups periods into today and following days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(baseDate);

    const grouped = groupHourlyPeriodsByDay(periods as any, 48, baseDate);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].label).toBe('Today');
    expect(grouped[0].periods).toHaveLength(1);
    expect(grouped[1].periods).toHaveLength(2);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty array when there are no periods', () => {
    const grouped = groupHourlyPeriodsByDay([], 48, baseDate);

    expect(grouped).toEqual([]);
  });

  it('extends the window to the end of the last day touched by the horizon', () => {
    const later = [
      { startTime: new Date(2024, 0, 3, 18, 0, 0).toISOString() },
      { startTime: new Date(2024, 0, 1, 1, 0, 0).toISOString() },
    ];

    const grouped = groupHourlyPeriodsByDay(later as any, 48, baseDate);

    expect(grouped.some((group) => group.label === 'Wednesday')).toBe(true);
    const wedGroup = grouped.find((group) => group.label === 'Wednesday');
    expect(wedGroup?.periods.some((p) => p.startTime.includes('T18:00:00'))).toBe(true);
  });
});
