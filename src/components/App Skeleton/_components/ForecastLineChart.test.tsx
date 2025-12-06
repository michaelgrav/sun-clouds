import { render } from '@test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ForecastLineChart } from './ForecastLineChart';

vi.mock('@mantine/hooks', async () => {
  const actual = await vi.importActual<typeof import('@mantine/hooks')>('@mantine/hooks');
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});

const buildPeriod = (overrides: Partial<any> = {}) => ({
  startTime: new Date(2024, 0, 1, 12, 0, 0).toISOString(),
  temperature: 68,
  probabilityOfPrecipitation: { value: 40 },
  ...overrides,
});

describe('ForecastLineChart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set current time to Jan 1, 2024 8:00 AM so test data (noon) is in the future window
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders temperature and precipitation charts when data exists', () => {
    const data = [
      buildPeriod({ temperature: 70, probabilityOfPrecipitation: { value: 20 } }),
      buildPeriod({ temperature: 65, probabilityOfPrecipitation: { value: 10 } }),
    ];

    const { container } = render(<ForecastLineChart data={data as any} />);

    expect(container.textContent).toContain('Temperature');
    expect(container.textContent).toContain("There's a chance of rain in the next 12 hours!");
  });

  it('omits precipitation chart when there is no chance of rain', () => {
    const data = [
      buildPeriod({ probabilityOfPrecipitation: { value: 0 } }),
      buildPeriod({ probabilityOfPrecipitation: { value: null } }),
    ];

    const { container } = render(<ForecastLineChart data={data as any} />);

    expect(container.textContent).toContain('Temperature');
    expect(container.textContent).not.toContain("There's a chance of rain in the next 12 hours!");
  });

  it('returns null when no data provided', () => {
    const { queryByText } = render(<ForecastLineChart data={undefined} />);

    expect(queryByText('Temperature')).toBeNull();
    expect(queryByText("There's a chance of rain in the next 12 hours!")).toBeNull();
  });
});
