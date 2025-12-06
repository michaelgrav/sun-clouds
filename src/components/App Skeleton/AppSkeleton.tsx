import { AppShell, Burger, Center, Divider, Group, Loader, Text, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useWeatherData } from '../../hooks/useWeatherData';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { CurrentSummaryCard } from './_components/CurrentSummaryCard';
import { DailyForecastCards } from './_components/DailyForecastCards';
import ForecastLineChart from './_components/ForecastLineChart';
import { HourlyTables } from './_components/HourlyTables';
import WeatherAlertsCard from './_components/WeatherAlertsCard';
import WeatherRadarModal from './_components/WeatherRadarModal';

export function AppSkeleton() {
  const [opened, { toggle }] = useDisclosure();
  const isSmall = useMediaQuery('(max-width: 768px)');

  const { weatherData, weatherForecast, hourlyWeatherForecast, activeAlerts, latitude, longitude } =
    useWeatherData();

  const dailyPeriods = weatherForecast?.properties?.periods?.slice(1);
  const hourlyPeriods = hourlyWeatherForecast?.properties?.periods;

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
        {hourlyPeriods ? (
          <>
            <WeatherAlertsCard alerts={activeAlerts} />
            <CurrentSummaryCard
              summary={weatherForecast?.properties?.periods[0]?.detailedForecast}
            />

            <Divider my="md" variant="dotted" size="md" />

            <Title order={1} ta="center" mt={25} mb={15}>
              Hourly Forecast{' '}
              {weatherData
                ? `for ${weatherData?.properties?.relativeLocation?.properties?.city}, ${weatherData?.properties?.relativeLocation?.properties?.state}`
                : 'for '}
            </Title>

            <ForecastLineChart data={hourlyPeriods} />

            <HourlyTables periods={hourlyPeriods} />
          </>
        ) : (
          <Center>
            <Loader color="yellow" size="xl" mt={20} data-testid="hourly-loader" />
          </Center>
        )}
      </AppShell.Main>

      <WeatherRadarModal latitude={latitude} longitude={longitude} />
    </AppShell>
  );
}
