import { getFilteredChartTooltipPayload, LineChart } from '@mantine/charts';
import {
  Paper,
  Skeleton,
  Stack,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import { Period } from '../../../../types/weather';

type ChartTooltipProps = {
  label?: React.ReactNode;
  payload?: ReadonlyArray<{ name?: string; value?: unknown; color?: string }>;
  active?: boolean;
  onHoldReveal?: () => void;
  onHoldCancel?: () => void;
  showSecret?: boolean;
};

interface ForecastLineChartProps {
  data?: Period[];
}

const roundToStep = (value: number, step: number, direction: 'floor' | 'ceil') =>
  direction === 'floor' ? Math.floor(value / step) * step : Math.ceil(value / step) * step;

const ChartTooltip = ({
  label,
  payload,
  active,
  onHoldReveal,
  onHoldCancel,
  showSecret,
}: ChartTooltipProps) => {
  const holdTimerRef = useRef<number | null>(null);
  const filtered = getFilteredChartTooltipPayload(Array.from(payload ?? []));
  const stopTimer = () => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (active && filtered.length) {
      if (!holdTimerRef.current) {
        holdTimerRef.current = window.setTimeout(() => {
          onHoldReveal?.();
        }, 3000);
      }
    } else {
      onHoldCancel?.();
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [active, label, filtered, onHoldReveal, onHoldCancel]);

  if (!filtered.length) {
    return null;
  }

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={600} mb={6} size="sm">
        {label}
      </Text>
      {filtered.map((item) => (
        <Text key={item.name} c={item.color} size="sm">
          {item.name}: {item.value}
          {item.name.toLowerCase().includes('temperature') ? '°F' : '%'}
        </Text>
      ))}

      {showSecret && (
        <Text mt={8} fw={700} size="sm" c="#e53981">
          Hey Jordyn, you found a secret!!!
        </Text>
      )}
    </Paper>
  );
};

export const ForecastLineChart = ({ data }: ForecastLineChartProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showSecretTooltip, setShowSecretTooltip] = useState(false);
  const hoursToShow = isMobile ? 4 : 12;
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const holdResetRef = useRef<number | null>(null);

  const now = useMemo(() => new Date(), []);

  const filteredPeriods = useMemo(() => filterActivePeriods(data ?? [], now), [data, now]);

  const cardStyle = {
    background:
      colorScheme === 'dark'
        ? 'linear-gradient(135deg, #162235 0%, #0e1724 100%)'
        : 'linear-gradient(135deg, #fff9e6 0%, #e8f5ff 100%)',
    border: `1px solid ${colorScheme === 'dark' ? 'rgba(140, 199, 255, 0.35)' : '#a9d4ff'}`,
    boxShadow:
      colorScheme === 'dark'
        ? '0 10px 24px rgba(0,0,0,0.35)'
        : '0 8px 20px rgba(10, 68, 122, 0.08)',
  } as const;

  const shouldShowSkeleton = !chartData.length;

  if (shouldShowSkeleton) {
    return (
      <Stack gap="md" data-testid="forecast-line-skeleton" mb="xl">
        <Paper withBorder shadow="sm" radius="md" p="md">
          <Skeleton height={14} width="32%" mb={8} radius="xl" />
          <Skeleton height={18} width="40%" mb="sm" radius="sm" />
          <Skeleton height={12} width="48%" mb="sm" radius="xl" />
          <Skeleton height={300} radius="md" />
        </Paper>
        <Paper withBorder shadow="sm" radius="md" p="md">
          <Skeleton height={12} width="28%" mb={8} radius="xl" />
          <Skeleton height={14} width="35%" mb={8} radius="sm" />
          <Skeleton height={12} width="44%" mb="sm" radius="xl" />
          <Skeleton height={200} radius="md" />
        </Paper>
      </Stack>
    );
  }

  return (
    <>
      <Paper withBorder shadow="sm" radius="md" p="md" mb="xl" style={cardStyle}>
        <Text
          fw={700}
          size="md"
          mb="sm"
          c={colorScheme === 'dark' ? theme.colors.sky[0] : '#0b2a3a'}
        >
          Temperature
        </Text>
        <LineChart
          h={360}
          data={chartData}
          dataKey="date"
          series={temperatureSeries}
          lineChartProps={{
            // Keep charts visually aligned but do not sync tooltips between charts
            margin: { top: 12, right: 36, left: 16, bottom: 16 },
          }}
          strokeWidth={3}
          curveType="natural"
          yAxisLabel="Temp (°F)"
          yAxisProps={{
            domain: [minTemp ?? 'auto', maxTemp ?? 'auto'],
            ticks: temperatureTicks,
            tickCount: temperatureTicks?.length,
            allowDecimals: false,
          }}
          gridAxis="x"
          valueFormatter={(value) => `${value}°F`}
          tooltipAnimationDuration={200}
          tooltipProps={{
            content: (props: ChartTooltipProps) => (
              <ChartTooltip
                {...props}
                onHoldReveal={handleHoldReveal}
                onHoldCancel={handleHoldCancel}
                showSecret={showSecretTooltip}
              />
            ),
          }}
          dotProps={{ r: 3 }}
        />
      </Paper>

      {hasPrecip && (
        <Paper withBorder shadow="sm" radius="md" p="md" mb="xl" style={cardStyle}>
          <Text
            size="sm"
            fw={600}
            ta="center"
            mb="xs"
            c={colorScheme === 'dark' ? theme.colors.sky[0] : '#0b2a3a'}
          >
            There&apos;s a chance of rain in the next {hoursToShow} hours!
          </Text>
          <LineChart
            h={240}
            data={chartData}
            dataKey="date"
            series={precipSeries}
            lineChartProps={{
              // Keep charts visually aligned but do not sync tooltips between charts
              margin: { top: 12, right: 36, left: 16, bottom: 16 },
            }}
            connectNulls={false}
            strokeWidth={3}
            curveType="natural"
            yAxisLabel="Precip (%)"
            yAxisProps={{ domain: [0, 100], tickMargin: 8, tickCount: 6, allowDecimals: false }}
            gridAxis="y"
            valueFormatter={(value) => `${value}%`}
            tooltipAnimationDuration={200}
            tooltipProps={{
              content: (props: ChartTooltipProps) => (
                <ChartTooltip
                  {...props}
                  onHoldReveal={handleHoldReveal}
                  onHoldCancel={handleHoldCancel}
                  showSecret={showSecretTooltip}
                />
              ),
            }}
            dotProps={{ r: 3 }}
            activeDotProps={{ r: 5, strokeWidth: 1 }}
          />
        </Paper>
      )}
    </>
  );
};

export default ForecastLineChart;
