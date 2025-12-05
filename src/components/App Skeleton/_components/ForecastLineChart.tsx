import { getFilteredChartTooltipPayload, LineChart } from '@mantine/charts';
import { Paper, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Period } from '../../../../types/weather';

interface ForecastLineChartProps {
  data?: Period[];
}

const ChartTooltip = ({
  label,
  payload,
}: {
  label: React.ReactNode;
  payload?: ReadonlyArray<Record<string, any>>;
}) => {
  const filtered = getFilteredChartTooltipPayload(Array.from(payload ?? []));
  if (!filtered.length) return null;

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

  if (!data?.length) {
    return null;
  }

  const chartData = data.slice(0, hoursToShow).map((period) => {
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
    minTempRaw != null && maxTempRaw != null
      ? Math.floor(minTempRaw - buffer)
      : minTempRaw;
  const maxTemp =
    minTempRaw != null && maxTempRaw != null
      ? Math.ceil(maxTempRaw + buffer)
      : maxTempRaw;

  const hasPrecip = chartData.some(
    (point) => typeof point.precipitation === 'number' && point.precipitation > 0
  );

  return (
    <>
      <LineChart
        h={360}
        mb={hasPrecip ? 30 : 50}
        data={chartData}
        dataKey="date"
        series={[
          {
            name: 'temperature',
            label: 'Temperature',
            color: 'yellow.5',
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
        tooltipProps={{
          content: ({ label, payload }) => (
            <ChartTooltip label={label} payload={payload as ReadonlyArray<Record<string, any>>} />
          ),
        }}
        dotProps={{ r: 3}}
      />

      {hasPrecip && (
        <>
          <Text mt="xl" size="sm" fw={600} ta="center">
            There&apos;s a chance of rain in the next {hoursToShow} hours!
          </Text>
          <LineChart
            h={240}
            mb={75}
            data={chartData}
            dataKey="date"
            series={[
              {
                name: 'precipitation',
                label: 'Precipitation',
                color: 'blue.5',
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
            tooltipProps={{
              content: ({ label, payload }) => (
                <ChartTooltip label={label} payload={payload as ReadonlyArray<Record<string, any>>} />
              ),
            }}
            dotProps={{ r: 3 }}
            activeDotProps={{ r: 5, strokeWidth: 1 }}
          />
        </>
      )}
    </>
  );
};

export default ForecastLineChart;