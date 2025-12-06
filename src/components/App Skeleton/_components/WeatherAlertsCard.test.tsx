import { render, screen } from '@test-utils';
import { describe, expect, it } from 'vitest';
import { WeatherAlertsCard } from './WeatherAlertsCard';

const mockAlerts = [
  {
    id: 'alert-1',
    properties: {
      headline: 'Severe Thunderstorm Warning',
      description: 'Damaging winds expected. Seek shelter indoors.',
      severity: 'Severe',
      event: 'Thunderstorm',
    },
  },
];

describe('WeatherAlertsCard', () => {
  it('renders nothing when there are no alerts', () => {
    render(<WeatherAlertsCard alerts={[]} />);

    expect(screen.queryByText('Active Weather Alerts')).not.toBeInTheDocument();
  });

  it('renders active alerts', () => {
    render(<WeatherAlertsCard alerts={mockAlerts} />);

    expect(screen.getByText('Active Weather Alerts')).toBeInTheDocument();
    expect(screen.getByText('Severe Thunderstorm Warning')).toBeInTheDocument();
    expect(screen.getByText(/Damaging winds expected/i)).toBeInTheDocument();
  });
});
