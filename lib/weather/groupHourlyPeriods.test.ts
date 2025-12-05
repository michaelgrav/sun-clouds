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
});
