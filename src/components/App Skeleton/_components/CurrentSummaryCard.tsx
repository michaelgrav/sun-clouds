import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Card,
  Skeleton,
  Stack,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import getWeatherEmoji from '../../../../lib/weather/getWeatherEmoji';
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

  const [isLeetActive, setIsLeetActive] = useState(false);
  const lastLeetDayRef = useRef<string | null>(null);
  const [goofyEmoji, setGoofyEmoji] = useState<string | null>(null);
  const goofyTimeoutRef = useRef<number | null>(null);
  const catHoldTimeoutRef = useRef<number | null>(null);

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

  const baseEmoji = useMemo(
    () => getWeatherEmoji(currentPeriod?.icon, currentPeriod?.shortForecast),
    [currentPeriod?.icon, currentPeriod?.shortForecast]
  );

  const displayEmoji = goofyEmoji ?? baseEmoji;

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

  useEffect(() => {
    const triggerLeet = () => {
      setIsLeetActive(true);
      window.setTimeout(() => setIsLeetActive(false), 12000);
    };

    const checkTime = () => {
      const now = new Date();
      const todayKey = now.toDateString();

      if (now.getHours() === 13 && now.getMinutes() === 37) {
        if (lastLeetDayRef.current !== todayKey) {
          lastLeetDayRef.current = todayKey;
          triggerLeet();
        }
      }
    };

    checkTime();
    const intervalId = window.setInterval(checkTime, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(
    () => () => {
      if (goofyTimeoutRef.current) {
        window.clearTimeout(goofyTimeoutRef.current);
      }
      if (catHoldTimeoutRef.current) {
        window.clearTimeout(catHoldTimeoutRef.current);
      }
    },
    []
  );

  const handleEmojiHoldStart = () => {
    if (catHoldTimeoutRef.current) {
      window.clearTimeout(catHoldTimeoutRef.current);
    }
    catHoldTimeoutRef.current = window.setTimeout(() => {
      setGoofyEmoji('🐱');
      if (goofyTimeoutRef.current) {
        window.clearTimeout(goofyTimeoutRef.current);
      }
      goofyTimeoutRef.current = window.setTimeout(() => setGoofyEmoji(null), 3500);
    }, 250);
  };

  const handleEmojiHoldEnd = () => {
    if (catHoldTimeoutRef.current) {
      window.clearTimeout(catHoldTimeoutRef.current);
      catHoldTimeoutRef.current = null;
    }
  };

  const wiggleStyles = `
@keyframes leetWiggle {
  0% { transform: rotate(0deg) translateY(0); }
  20% { transform: rotate(-2deg) translateY(-2px); }
  40% { transform: rotate(2deg) translateY(2px); }
  60% { transform: rotate(-2deg) translateY(-1px); }
  80% { transform: rotate(2deg) translateY(1px); }
  100% { transform: rotate(0deg) translateY(0); }
}
`;

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="md"
      withBorder
      mb="35"
      style={{
        ...cardStyle,
        ...(isLeetActive ? { animation: 'leetWiggle 0.5s ease-in-out 0s 10' } : {}),
      }}
    >
      <style>{wiggleStyles}</style>

      {isLeetActive && (
        <Alert
          color="yellow"
          radius="md"
          mb="sm"
          variant="light"
          title="Leet weather check completed."
          styles={{ title: { fontWeight: 800 } }}
        >
          <Text size="sm" c={bodyColor}>
            Thanks for stopping by at 13:37 — the forecast is feeling extra elite.
          </Text>
        </Alert>
      )}

      <Card.Section>
        <Text size="lg" mt="md" mb="xs" ta="center" fw={700} c={headingColor}>
          Current Weather Summary
        </Text>
      </Card.Section>

      <Stack gap={8} align="center" mb="sm">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, justifyContent: 'center' }}>
          <Text
            size="64"
            lh={1}
            style={{ cursor: 'pointer' }}
            onPointerDown={handleEmojiHoldStart}
            onPointerUp={handleEmojiHoldEnd}
            onPointerLeave={handleEmojiHoldEnd}
            title="Press and hold for a surprise"
          >
            {displayEmoji}
          </Text>

          {currentTemp ? (
            <Text size="56" fw={900} lh={1} ta="center" c={headingColor}>
              {currentTemp}
            </Text>
          ) : (
            <Skeleton width={140} height={52} radius="sm" />
          )}
        </div>

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
