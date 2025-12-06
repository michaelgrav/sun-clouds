import {
  Card,
  Skeleton,
  Stack,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import { Period } from '../../../../types/weather';

interface CurrentSummaryCardProps {
  summary?: string;
  hourlyPeriods?: Period[];
}

const formatTemperatureValue = (temperature?: number | null, unit?: string | null) => {
  if (temperature == null || Number.isNaN(temperature)) {
    return null;
  }

  const unitSuffix = unit ? `°${unit}` : '°';
  return `${Math.round(temperature)}${unitSuffix}`;
};

const isSameLocalDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getTodayHighLow = (periods: Period[] = [], fallbackUnit?: string | null) => {
  const now = new Date();
  const todaysPeriods = periods
    .map((period) => ({
      period,
      start: new Date(period.startTime),
    }))
    .filter(({ start }) => !Number.isNaN(start.getTime()) && isSameLocalDay(start, now));

  const temps = todaysPeriods
    .map(({ period }) => period.temperature)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

  const unit =
    todaysPeriods.find(({ period }) => period.temperatureUnit)?.period.temperatureUnit ??
    fallbackUnit ??
    null;

  if (!temps.length) {
    return { high: null, low: null, unit } as const;
  }

  return {
    high: Math.max(...temps),
    low: Math.min(...temps),
    unit,
  } as const;
};

const getCurrentPeriod = (periods: Period[] = []) => filterActivePeriods(periods)[0];

export const CurrentSummaryCard = ({ summary, hourlyPeriods }: CurrentSummaryCardProps) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const currentPeriod = getCurrentPeriod(hourlyPeriods ?? []);
  const currentTemp = formatTemperatureValue(
    currentPeriod?.temperature,
    currentPeriod?.temperatureUnit ?? undefined
  );

  const precipChance = currentPeriod?.probabilityOfPrecipitation?.value;
  const rainChanceText =
    typeof precipChance === 'number' && precipChance >= 0
      ? `${Math.round(precipChance)}% chance of rain`
      : null;

  const conditionsText = currentPeriod?.shortForecast ?? 'Conditions unavailable';

  const { high, low, unit } = getTodayHighLow(hourlyPeriods ?? [], currentPeriod?.temperatureUnit);
  const highLowText =
    high != null || low != null
      ? `↑ High ${formatTemperatureValue(high, unit) ?? '--'} / ↓ Low ${
          formatTemperatureValue(low, unit) ?? '--'
        }`
      : null;

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

  const headingColor = colorScheme === 'dark' ? theme.colors.sky[0] : '#0b2a3a';
  const bodyColor = colorScheme === 'dark' ? theme.colors.sky[1] : theme.black;

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder mb="35" style={cardStyle}>
      <Card.Section>
        <Text size="lg" mt="md" mb="xs" ta="center" fw={700} c={headingColor}>
          Current Weather Summary
        </Text>
      </Card.Section>

      <Stack gap={6} align="center" mb="sm">
        {currentTemp ? (
          <Text size="56" fw={900} lh={1} ta="center" c={headingColor}>
            {currentTemp}
          </Text>
        ) : (
          <Skeleton width={140} height={52} radius="sm" />
        )}

        <Text size="sm" ta="center" c={bodyColor}>
          {rainChanceText ? `${conditionsText} - ${rainChanceText}` : conditionsText}
        </Text>

        {highLowText ? (
          <Text size="sm" ta="center" c={bodyColor}>
            {highLowText}
          </Text>
        ) : null}
      </Stack>

      <Text size="sm" ta="center" c={bodyColor}>
        📝 Detailed description:{' '}
        {summary || "No summary available :( I guess you're gonna have to look outside..."}
      </Text>
    </Card>
  );
};
