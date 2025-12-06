import { render, screen } from '@test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HourlyTables } from './HourlyTables';

const baseDate = new Date(2024, 0, 1, 0, 0, 0);

const periods = [
  {
    startTime: new Date(2024, 0, 1, 12, 0, 0).toISOString(),
    temperature: 70,
    temperatureUnit: 'F',
    probabilityOfPrecipitation: { value: 10 },
    shortForecast: 'Patchy Fog',
    icon: 'https://api.weather.gov/icons/land/day/fog?size=small',
  },
  {
    startTime: new Date(2024, 0, 2, 12, 0, 0).toISOString(),
    temperature: 58,
    temperatureUnit: 'F',
    probabilityOfPrecipitation: { value: 20 },
    shortForecast: 'Mostly Sunny',
    icon: 'https://api.weather.gov/icons/land/day/skc?size=small',
  },
];

describe('HourlyTables', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(baseDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders grouped tables for today and next day', () => {
    const nextDayLabel = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString([], {
      weekday: 'long',
    });

    render(<HourlyTables periods={periods as any} />);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText(nextDayLabel)).toBeInTheDocument();

    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('70F')).toBeInTheDocument();
    expect(screen.getByText('58F')).toBeInTheDocument();
    expect(screen.getByText('🌫️')).toBeInTheDocument();
    expect(screen.getByText('Patchy Fog')).toBeInTheDocument();
  });

  it('renders nothing when periods are empty', () => {
    render(<HourlyTables periods={[]} />);

    expect(screen.queryByText('Today')).toBeNull();
  });

  it('filters out periods that ended before now', () => {
    vi.setSystemTime(new Date(2024, 0, 1, 11, 15, 0));

    render(
      <HourlyTables
        periods={
          [
            {
              startTime: new Date(2024, 0, 1, 10, 0, 0).toISOString(),
              endTime: new Date(2024, 0, 1, 11, 0, 0).toISOString(),
              temperature: 60,
              temperatureUnit: 'F',
              probabilityOfPrecipitation: { value: 40 },
              shortForecast: 'Rain',
              icon: 'https://api.weather.gov/icons/land/day/rain?size=small',
            },
            {
              startTime: new Date(2024, 0, 1, 12, 0, 0).toISOString(),
              endTime: new Date(2024, 0, 1, 13, 0, 0).toISOString(),
              temperature: 70,
              temperatureUnit: 'F',
              probabilityOfPrecipitation: { value: 10 },
              shortForecast: 'Sunny',
              icon: 'https://api.weather.gov/icons/land/day/skc?size=small',
            },
          ] as any
        }
      />
    );

    expect(screen.queryByText('10 AM')).toBeNull();
    expect(screen.getByText('12 PM')).toBeInTheDocument();
  });
});
