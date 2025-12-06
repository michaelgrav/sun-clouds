import { render, screen } from '@test-utils';
import { describe, expect, it } from 'vitest';
import { DailyForecastCards } from './DailyForecastCards';

const periods = [
  { name: 'Tuesday', detailedForecast: 'Sunny' },
  { name: 'Wednesday', detailedForecast: 'Cloudy' },
];

describe('DailyForecastCards', () => {
  it('renders skeletons when no data', () => {
    render(<DailyForecastCards periods={undefined} />);

    expect(screen.getByTestId('daily-skeleton')).toBeInTheDocument();
  });

  it('renders cards with names and summaries', () => {
    render(<DailyForecastCards periods={periods as any} />);

    expect(screen.getByText('7-Day Forecast')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('Wednesday')).toBeInTheDocument();
    expect(screen.getByText('Cloudy')).toBeInTheDocument();
  });
});
