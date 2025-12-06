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
    render(
      <HourlyForecastSection hourlyPeriods={undefined} locationLabel={null} hasHourlyData={false} />
    );

    expect(screen.getByTestId('location-skeleton')).toBeInTheDocument();
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
        locationLabel="Portland, OR"
        hasHourlyData
      />
    );

    expect(screen.getByText(/Hourly Forecast for Portland, OR/)).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText(tomorrowLabel)).toBeInTheDocument();
  });
});
