import { render, screen } from '@test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppSkeleton } from './AppSkeleton';

const mockUseWeatherData = vi.fn();

vi.mock('../../hooks/useWeatherData', () => ({
  useWeatherData: () => mockUseWeatherData(),
}));

const baseDate = new Date(2024, 0, 1, 12, 0, 0);

describe('AppSkeleton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(baseDate);
    mockUseWeatherData.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows skeletons while hourly data is absent', () => {
    mockUseWeatherData.mockReturnValue({
      weatherData: null,
      weatherForecast: null,
      hourlyWeatherForecast: null,
      activeAlerts: [],
      latitude: null,
      longitude: null,
      setCoordinates: vi.fn(),
      isLoading: true,
      errors: {},
      geolocationDenied: false,
      selectedLocationLabel: null,
      clearErrors: vi.fn(),
      dismissGeolocationWarning: vi.fn(),
    });

    render(<AppSkeleton />);

    expect(screen.getByTestId('location-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('summary-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-line-suspense')).toBeInTheDocument();
  });

  it('renders summary, location, and grouped hourly tables', () => {
    const tomorrowLabel = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString(
      [],
      { weekday: 'long' }
    );

    mockUseWeatherData.mockReturnValue({
      weatherData: {
        properties: {
          relativeLocation: { properties: { city: 'Portland', state: 'OR' } },
        },
      },
      weatherForecast: {
        properties: {
          periods: [
            { name: 'Now', detailedForecast: 'Sunny with light breeze' },
            { name: 'Tonight', detailedForecast: 'Clear skies' },
          ],
        },
      },
      hourlyWeatherForecast: {
        properties: {
          periods: [
            {
              startTime: new Date(2024, 0, 1, 13, 0, 0).toISOString(),
              temperature: 70,
              temperatureUnit: 'F',
              probabilityOfPrecipitation: { value: 10 },
            },
            {
              startTime: new Date(2024, 0, 2, 10, 0, 0).toISOString(),
              temperature: 58,
              temperatureUnit: 'F',
              probabilityOfPrecipitation: { value: 20 },
            },
          ],
        },
      },
      activeAlerts: [],
      latitude: 40,
      longitude: -74,
      setCoordinates: vi.fn(),
      isLoading: false,
      errors: {},
      geolocationDenied: false,
      selectedLocationLabel: null,
      clearErrors: vi.fn(),
      dismissGeolocationWarning: vi.fn(),
    });

    render(<AppSkeleton />);

    expect(screen.getByText('Current Weather Summary')).toBeInTheDocument();
    expect(screen.getByText(/Sunny with light breeze/)).toBeInTheDocument();
    expect(screen.getByText(/Forecast for Portland, OR/)).toBeInTheDocument();

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText(tomorrowLabel)).toBeInTheDocument();

    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('70F')).toBeInTheDocument();
  });
});
