import { AppShell, Divider } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useWeatherData } from '../../hooks/useWeatherData';
import { AppHeader } from './_components/AppHeader';
import { DailyForecastCards } from './_components/DailyForecastCards';
import { HourlyForecastSection } from './_components/HourlyForecastSection';
import LocationSearchButton from './_components/LocationSearchButton';
import { SummarySection } from './_components/SummarySection';
import WeatherRadarModal from './_components/WeatherRadarModal';

export function AppSkeleton() {
  const [opened, { toggle }] = useDisclosure();
  const [isSearchOpen, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [isRadarOpen, { open: openRadar, close: closeRadar }] = useDisclosure(false);
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
      <AppHeader opened={opened} onToggle={toggle} isSmallScreen={isSmall ?? false} />

      <AppShell.Navbar p={0} style={{ background: 'var(--app-bg, #f7fbff)' }}>
        <DailyForecastCards periods={dailyPeriods} />
      </AppShell.Navbar>

      <AppShell.Main>
        <SummarySection summary={summary} alerts={activeAlerts} />

        <Divider my="md" variant="dotted" size="md" />

        <HourlyForecastSection hourlyPeriods={hourlyPeriods} locationLabel={locationLabel} />
      </AppShell.Main>

      <LocationSearchButton
        opened={isSearchOpen}
        onOpen={() => {
          closeRadar();
          openSearch();
        }}
        onClose={closeSearch}
        onLocationSelect={(lat, lon) => setCoordinates(lat, lon)}
      />
      <WeatherRadarModal
        opened={isRadarOpen}
        onOpen={() => {
          closeSearch();
          openRadar();
        }}
        onClose={closeRadar}
        latitude={latitude}
        longitude={longitude}
      />
    </AppShell>
  );
}
