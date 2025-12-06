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
import { Period } from '../../../../types/weather';

type ChartTooltipProps = {
  label?: React.ReactNode;
  payload?: ReadonlyArray<{ name?: string; value?: unknown; color?: string }>;
};

interface ForecastLineChartProps {
  data?: Period[];
}

const ChartTooltip = ({ label, payload }: ChartTooltipProps) => {
  const filtered = getFilteredChartTooltipPayload(Array.from(payload ?? []));
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
    </Paper>
  );
};

export const ForecastLineChart = ({ data }: ForecastLineChartProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const hoursToShow = isMobile ? 4 : 12;
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const now = new Date();
  const currentHourStart = new Date(now);
  currentHourStart.setMinutes(0, 0, 0);

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

  if (!data?.length) {
    return (
      <Stack gap="md" data-testid="forecast-line-skeleton" mb="xl">
        <Paper withBorder shadow="sm" radius="md" p="md" style={cardStyle}>
          <Skeleton height={18} width="40%" mb="sm" radius="sm" />
          <Skeleton height={300} radius="md" />
        </Paper>
        <Paper withBorder shadow="sm" radius="md" p="md" style={cardStyle}>
          <Skeleton height={14} width="35%" mb="sm" radius="sm" />
          <Skeleton height={200} radius="md" />
        </Paper>
      </Stack>
    );
  }

  const chartData = data
    .filter((period) => {
      const start = new Date(period.startTime);
      return start >= currentHourStart;
    })
    .slice(0, hoursToShow)
    .map((period) => {
      const date = new Date(period.startTime);
      return {
        date: date.toLocaleTimeString([], { hour: 'numeric' }),
        temperature: period.temperature,
        precipitation: period.probabilityOfPrecipitation?.value ?? null,
      };
    });

  const temps = chartData
    .map((point) => point.temperature)
    .filter((t): t is number => typeof t === 'number');

  const minTempRaw = temps.length ? Math.min(...temps) : undefined;
  const maxTempRaw = temps.length ? Math.max(...temps) : undefined;

  // Add a larger buffer so the line is not clipped at chart edges.
  const buffer = 10;
  const minTemp =
    minTempRaw != null && maxTempRaw != null ? Math.floor(minTempRaw - buffer) : minTempRaw;
  const maxTemp =
    minTempRaw != null && maxTempRaw != null ? Math.ceil(maxTempRaw + buffer) : maxTempRaw;

  const hasPrecip = chartData.some(
    (point) => typeof point.precipitation === 'number' && point.precipitation > 0
  );

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
          series={[
            {
              name: 'temperature',
              label: 'Temperature',
              color: colorScheme === 'dark' ? '#ffb429' : '#ffb429',
            },
          ]}
          lineChartProps={{
            // Keep charts visually aligned but do not sync tooltips between charts
            margin: { top: 12, right: 36, left: 16, bottom: 16 },
          }}
          strokeWidth={3}
          curveType="natural"
          yAxisLabel="Temp (°F)"
          yAxisProps={{ domain: [minTemp ?? 'auto', maxTemp ?? 'auto'] }}
          valueFormatter={(value) => `${value}°F`}
          tooltipAnimationDuration={200}
          tooltipProps={{ content: (props: ChartTooltipProps) => <ChartTooltip {...props} /> }}
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
            series={[
              {
                name: 'precipitation',
                label: 'Precipitation',
                color: colorScheme === 'dark' ? theme.colors.sky[3] : theme.colors.sky[5],
                strokeDasharray: '6 3',
              },
            ]}
            lineChartProps={{
              // Keep charts visually aligned but do not sync tooltips between charts
              margin: { top: 12, right: 36, left: 16, bottom: 16 },
            }}
            connectNulls={false}
            strokeWidth={3}
            curveType="natural"
            yAxisLabel="Precip (%)"
            yAxisProps={{ domain: [0, 100], tickMargin: 8 }}
            valueFormatter={(value) => `${value}%`}
            tooltipAnimationDuration={200}
            tooltipProps={{ content: (props: ChartTooltipProps) => <ChartTooltip {...props} /> }}
            dotProps={{ r: 3 }}
            activeDotProps={{ r: 5, strokeWidth: 1 }}
          />
        </Paper>
      )}
    </>
  );
};

export default ForecastLineChart;
