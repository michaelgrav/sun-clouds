import { render, screen, userEvent } from '@test-utils';
import { describe, expect, it, vi } from 'vitest';
import WeatherRadarModal from './WeatherRadarModal';

vi.mock('@mantine/hooks', async () => {
  const actual = await vi.importActual<typeof import('@mantine/hooks')>('@mantine/hooks');
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});

describe('WeatherRadarModal', () => {
  it('toggles modal open and close using the action button', async () => {
    const user = userEvent.setup();
    render(<WeatherRadarModal latitude={40} longitude={-74} />);

    const toggleButton = screen.getByRole('button', { name: /open radar map/i });

    expect(screen.queryByText(/live weather radar/i)).toBeNull();

    await user.click(toggleButton);

    expect(screen.getByText(/live weather radar/i)).toBeInTheDocument();
    expect(screen.getByTitle('Weather Radar')).toBeInTheDocument();

    await user.click(toggleButton);

    expect(screen.queryByText(/live weather radar/i)).toBeNull();
    expect(screen.queryByTitle('Weather Radar')).toBeNull();
  });

  it('shows skeleton when coordinates are missing', async () => {
    const user = userEvent.setup();
    render(<WeatherRadarModal latitude={null} longitude={null} />);

    const toggleButton = screen.getByRole('button', { name: /open radar map/i });
    await user.click(toggleButton);

    expect(screen.getByText(/live weather radar/i)).toBeInTheDocument();
    expect(screen.getByTestId('radar-skeleton')).toBeInTheDocument();
    expect(screen.queryByTitle('Weather Radar')).toBeNull();
  });
});
