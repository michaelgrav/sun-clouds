import { describe, expect, it } from 'vitest';
import { formatHour } from './formatHour';

describe('formatHour', () => {
  it('returns empty string for missing input', () => {
    expect(formatHour()).toBe('');
  });

  it('formats time string safely', () => {
    const iso = '2024-01-01T15:00:00Z';
    const expected = new Date(iso).toLocaleTimeString([], { hour: 'numeric', hour12: true });

    expect(formatHour(iso)).toBe(expected);
  });
});
