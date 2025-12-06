import { render, screen } from '@test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CurrentSummaryCard } from './CurrentSummaryCard';

afterEach(() => {
  vi.useRealTimers();
});

describe('CurrentSummaryCard', () => {
  it('renders provided summary', () => {
    render(<CurrentSummaryCard summary="Clear skies" />);

    expect(screen.getByText('Current Weather Summary')).toBeInTheDocument();
    expect(
      screen.getByText('📝 Detailed description: Clear skies', { exact: false })
    ).toBeInTheDocument();
  });

  it('renders fallback when summary missing', () => {
    render(<CurrentSummaryCard />);

    expect(
      screen.getByText(
        "📝 Detailed description: No summary available :( I guess you're gonna have to look outside..."
      )
    ).toBeInTheDocument();
  });

  it('shows current hour readings and daily range when hourly data is provided', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    render(
      <CurrentSummaryCard
        summary="Plenty of sunshine with a late breeze"
        hourlyPeriods={[
          {
            startTime: new Date('2024-01-01T12:00:00Z').toISOString(),
            temperature: 70,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 40 },
            shortForecast: 'Mostly Sunny',
            windSpeed: '5 mph',
          },
          {
            startTime: new Date('2024-01-01T15:00:00Z').toISOString(),
            temperature: 75,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 10 },
            shortForecast: 'Sunny',
            windSpeed: '7 mph',
          },
          {
            startTime: new Date('2024-01-01T06:00:00Z').toISOString(),
            temperature: 60,
            temperatureUnit: 'F',
            probabilityOfPrecipitation: { value: 5 },
            shortForecast: 'Clear',
            windSpeed: '4 mph',
          },
        ]}
      />
    );

    expect(screen.getByText('70°F')).toBeInTheDocument();
    expect(screen.getByText('↑ High 75°F / ↓ Low 60°F')).toBeInTheDocument();
    expect(screen.getByText('Mostly Sunny - 40% chance of rain')).toBeInTheDocument();
    expect(
      screen.getByText('📝 Detailed description: Plenty of sunshine with a late breeze')
    ).toBeInTheDocument();

    vi.useRealTimers();
  });
});
