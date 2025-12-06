import { render, screen } from '@test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HourlyForecastSection } from './HourlyForecastSection';

describe('HourlyForecastSection', () => {
  const baseDate = new Date(2024, 0, 1, 12, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(baseDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows skeletons when data is missing', () => {
    render(<HourlyForecastSection hourlyPeriods={undefined} />);

    expect(screen.getByTestId('forecast-line-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('hourly-table-skeletons')).toBeInTheDocument();
  });

  it('renders hourly tables when data is available', () => {
    const tomorrowLabel = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(
      [],
      { weekday: 'long' }
    );

    render(
      <HourlyForecastSection
        hourlyPeriods={[
          {
            startTime: new Date(2024, 0, 1, 13, 0, 0).toISOString(),
            temperature: 70,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 10 },
            windSpeed: '5 mph',
            name: 'Now',
            detailedForecast: 'Sunny',
          },
          {
            startTime: new Date(2024, 0, 2, 10, 0, 0).toISOString(),
            temperature: 58,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 20 },
            windSpeed: '3 mph',
            name: 'Tomorrow',
            detailedForecast: 'Clear',
          },
        ]}
      />
    );

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText(tomorrowLabel)).toBeInTheDocument();
  });

  it('omits past hourly periods', () => {
    vi.setSystemTime(new Date(2024, 0, 1, 11, 15, 0));

    render(
      <HourlyForecastSection
        hourlyPeriods={[
          {
            startTime: new Date(2024, 0, 1, 10, 0, 0).toISOString(),
            temperature: 60,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 30 },
            windSpeed: '4 mph',
            name: 'Past',
            detailedForecast: 'Past hour',
          },
          {
            startTime: new Date(2024, 0, 1, 12, 0, 0).toISOString(),
            temperature: 70,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 10 },
            windSpeed: '6 mph',
            name: 'Upcoming',
            detailedForecast: 'Future hour',
          },
        ]}
      />
    );

    expect(screen.queryByText('10 AM')).toBeNull();
    expect(screen.getByText('12 PM')).toBeInTheDocument();
  });
});
