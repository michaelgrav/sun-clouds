import { AppShell, Burger, Center, Divider, Group, Loader, Text, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { useWeatherData } from '../../hooks/useWeatherData';
import { DailyForecastCards } from './_components/DailyForecastCards';
import { CurrentSummaryCard } from './_components/CurrentSummaryCard';
import { HourlyTables } from './_components/HourlyTables';
import ForecastLineChart from './_components/ForecastLineChart';

export function AppSkeleton() {
  const [opened, { toggle }] = useDisclosure();
  const isSmall = useMediaQuery('(max-width: 768px)');

  const { weatherData, weatherForecast, hourlyWeatherForecast } = useWeatherData();

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
          <Group style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Text size={isSmall ? 'md' : 'xl'} ml={isSmall ? 0 : 10} component="div">
              {' '}
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
            <ColorSchemeToggle/>
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <DailyForecastCards periods={dailyPeriods} />
      </AppShell.Navbar>

      <AppShell.Main>
        {hourlyPeriods ? (
          <>
            <CurrentSummaryCard summary={weatherForecast?.properties?.periods[0]?.detailedForecast} />

            <Divider my="md" variant="dotted" size="md"/>

            <Title order={1} ta="center" mt={25} mb={15}>
              Hourly Forecast {weatherData
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
    </AppShell>
  );
}
