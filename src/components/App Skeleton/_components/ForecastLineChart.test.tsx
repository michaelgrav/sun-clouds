import { render } from '@test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ForecastLineChart } from './ForecastLineChart';

vi.mock('@mantine/charts', () => ({
  LineChart: ({ data }: { data: Array<{ date: string }> }) => (
    <div data-testid="line-chart-mock">{data.map((point) => point.date).join(' | ')}</div>
  ),
  getFilteredChartTooltipPayload: (payload: unknown[]) => payload,
}));

vi.mock('@mantine/hooks', async () => {
  const actual = await vi.importActual<typeof import('@mantine/hooks')>('@mantine/hooks');
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});

const buildPeriod = (overrides: Partial<any> = {}) => {
  const start = new Date(2024, 0, 1, 12, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    temperature: 68,
    probabilityOfPrecipitation: { value: 40 },
    ...overrides,
  };
};

describe('ForecastLineChart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set current time to Jan 1, 2024 8:00 AM for most tests
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

  it('filters out periods that ended before now', () => {
    // Move clock to 9:15 AM so 8-9 AM period is past, 9-10 AM is current
    vi.setSystemTime(new Date(2024, 0, 1, 9, 15, 0));

    const pastStart = new Date(2024, 0, 1, 8, 0, 0);
    const pastEnd = new Date(2024, 0, 1, 9, 0, 0);
    const currentStart = new Date(2024, 0, 1, 9, 0, 0);
    const currentEnd = new Date(2024, 0, 1, 10, 0, 0);

    const data = [
      buildPeriod({
        startTime: pastStart.toISOString(),
        endTime: pastEnd.toISOString(),
        temperature: 60,
        probabilityOfPrecipitation: { value: 80 },
      }),
      buildPeriod({
        startTime: currentStart.toISOString(),
        endTime: currentEnd.toISOString(),
        temperature: 72,
        probabilityOfPrecipitation: { value: 50 },
      }),
    ];

    const { container } = render(<ForecastLineChart data={data as any} />);

    expect(container.textContent).toContain('Temperature');
    expect(container.textContent).toContain("There's a chance of rain in the next 12 hours!");
    expect(container.textContent).not.toContain('8 AM');
    expect(container.textContent).toContain('9 AM');
  });
});
