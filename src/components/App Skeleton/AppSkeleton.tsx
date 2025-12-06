import {
  AppShell,
  Burger,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useWeatherData } from '../../hooks/useWeatherData';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { CurrentSummaryCard } from './_components/CurrentSummaryCard';
import { DailyForecastCards } from './_components/DailyForecastCards';
import ForecastLineChart from './_components/ForecastLineChart';
import { HourlyTables } from './_components/HourlyTables';
import LocationSearchButton from './_components/LocationSearchButton';
import WeatherAlertsCard from './_components/WeatherAlertsCard';
import WeatherRadarModal from './_components/WeatherRadarModal';

export function AppSkeleton() {
  const [opened, { toggle }] = useDisclosure();
  const isSmall = useMediaQuery('(max-width: 768px)');

  const {
    weatherData,
    weatherForecast,
    hourlyWeatherForecast,
    activeAlerts,
    latitude,
    longitude,
    setCoordinates,
  } = useWeatherData();

  const dailyPeriods = weatherForecast?.properties?.periods?.slice(1);
  const hourlyPeriods = hourlyWeatherForecast?.properties?.periods;
  const summary = weatherForecast?.properties?.periods?.[0]?.detailedForecast;
  const hasHourlyData = Boolean(hourlyPeriods?.length);
  const locationLabel = weatherData
    ? `${weatherData?.properties?.relativeLocation?.properties?.city}, ${weatherData?.properties?.relativeLocation?.properties?.state}`
    : null;

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened },
      }}
    >
      <AppShell.Header>
        <Group
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Group style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              ml="xs"
              style={{ alignSelf: 'center' }}
              aria-label="Toggle navigation"
            />
            <Text size={isSmall ? 'md' : 'xl'} component="div" mt={-2}>
              ☀️ Sun Clouds ☁️
            </Text>
          </Group>

          <Text
            size={isSmall ? 'sm' : 'xl'}
            ta="right"
            mr={10}
            mt={-10}
            style={{
              textAlign: 'right',
            }}
            component="div"
          >
            <ColorSchemeToggle />
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <DailyForecastCards periods={dailyPeriods} />
      </AppShell.Navbar>

      <AppShell.Main>
        <WeatherAlertsCard alerts={activeAlerts} />

        {summary ? <CurrentSummaryCard summary={summary} /> : <SummarySkeleton />}

        <Divider my="md" variant="dotted" size="md" />

        <Stack gap="sm" align="center" mb="md">
          <Title order={1} ta="center" mt={10} mb={4}>
            Hourly Forecast for{' '}
            {locationLabel ? (
              locationLabel
            ) : (
              <Skeleton
                width={160}
                height={18}
                radius="xl"
                display="inline-block"
                data-testid="location-skeleton"
                style={{ verticalAlign: 'middle' }}
              />
            )}
          </Title>
        </Stack>

        <ForecastLineChart data={hourlyPeriods} />

        {hasHourlyData ? <HourlyTables periods={hourlyPeriods} /> : <HourlyTablesSkeleton />}
      </AppShell.Main>

      <LocationSearchButton onLocationSelect={(lat, lon) => setCoordinates(lat, lon)} />
      <WeatherRadarModal latitude={latitude} longitude={longitude} />
    </AppShell>
  );
}

const SummarySkeleton = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder mb="35" data-testid="summary-skeleton">
    <Skeleton height={18} width="45%" mb="sm" radius="sm" />
    <Skeleton height={12} width="92%" mb={8} radius="sm" />
    <Skeleton height={12} width="88%" mb={8} radius="sm" />
    <Skeleton height={12} width="80%" radius="sm" />
  </Card>
);

const HourlyTablesSkeleton = () => (
  <Stack gap="md" data-testid="hourly-table-skeletons" mt="md">
    {[0, 1].map((key) => (
      <Card key={key} shadow="sm" padding="md" radius="md" withBorder mb="6">
        <Skeleton height={16} width="35%" mb="sm" radius="sm" />
        <Stack gap={8}>
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} height={12} radius="sm" />
          ))}
        </Stack>
      </Card>
    ))}
  </Stack>
);
