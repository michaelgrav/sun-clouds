import { lazy, Suspense, useMemo } from 'react';
import {
  Alert,
  AppShell,
  Button,
  Skeleton,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useWeatherData } from '../../hooks/useWeatherData';
import { AppHeader } from './_components/AppHeader';
import { DailyForecastCards } from './_components/DailyForecastCards';
import { HourlyForecastSection } from './_components/HourlyForecastSection';
import LocationSearchButton from './_components/LocationSearchButton';
import { SummarySection } from './_components/SummarySection';

const WeatherRadarModal = lazy(() => import('./_components/WeatherRadarModal'));

export function AppSkeleton() {
  const [opened, { toggle }] = useDisclosure();
  const [isSearchOpen, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const [isRadarOpen, { open: openRadar, close: closeRadar }] = useDisclosure(false);
  const isSmall = useMediaQuery('(max-width: 768px)');
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const {
    weatherData,
    weatherForecast,
    hourlyWeatherForecast,
    activeAlerts,
    latitude,
    longitude,
    selectedLocationLabel,
    errors,
    geolocationDenied,
    setCoordinates,
    clearErrors,
    dismissGeolocationWarning,
  } = useWeatherData();

  const alertGradient =
    colorScheme === 'dark'
      ? 'linear-gradient(135deg, #162235 0%, #0e1724 100%)'
      : 'linear-gradient(135deg, #fff9e6 0%, #e8f5ff 100%)';
  const alertBorder = colorScheme === 'dark' ? 'rgba(140, 199, 255, 0.35)' : '#a9d4ff';
  const alertTextColor = colorScheme === 'dark' ? theme.colors.sky[0] : '#0b2a3a';

  const dailyPeriods = useMemo(
    () => weatherForecast?.properties?.periods?.slice(1) ?? null,
    [weatherForecast?.properties?.periods]
  );

  const hourlyPeriods = useMemo(
    () => hourlyWeatherForecast?.properties?.periods ?? null,
    [hourlyWeatherForecast?.properties?.periods]
  );

  const summary = useMemo(
    () => weatherForecast?.properties?.periods?.[0]?.detailedForecast ?? null,
    [weatherForecast?.properties?.periods]
  );

  const locationLabel = useMemo(() => {
    if (selectedLocationLabel) {
      return selectedLocationLabel;
    }

    const city = weatherData?.properties?.relativeLocation?.properties?.city;
    const state = weatherData?.properties?.relativeLocation?.properties?.state;
    if (city && state) {
      return `${city}, ${state}`;
    }
    return null;
  }, [selectedLocationLabel, weatherData?.properties?.relativeLocation?.properties]);

  const showDataError = Boolean(errors.points || errors.forecast || errors.hourly || errors.alerts);

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
        <DailyForecastCards periods={dailyPeriods ?? undefined} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Stack gap="md">
          {geolocationDenied && (
            <Alert
              withCloseButton
              onClose={dismissGeolocationWarning}
              data-testid="geo-denied-alert"
              title={
                <Text size="xl" fw={900} ta="center" c={alertTextColor} style={{ width: '100%' }}>
                  ⚠️ Location permission declined
                </Text>
              }
              styles={{
                title: { color: alertTextColor, width: '100%', justifyContent: 'center' },
                message: { color: alertTextColor },
                closeButton: { color: alertTextColor },
              }}
              style={{
                background: alertGradient,
                border: `1px solid ${alertBorder}`,
                boxShadow: '0 8px 20px rgba(10, 68, 122, 0.08)',
                color: alertTextColor,
              }}
            >
              <Stack gap="xs" align="center">
                <Text c={alertTextColor} ta="center">
                  We could not access your location. Use search to pick a place instead.
                </Text>
                <Button
                  mt="xs"
                  variant="light"
                  radius="xl"
                  onClick={() => {
                    dismissGeolocationWarning();
                    openSearch();
                  }}
                  styles={{
                    root: {
                      background: alertGradient,
                      border: `1px solid ${alertBorder}`,
                      color: alertTextColor,
                      boxShadow: '0 6px 16px rgba(10, 68, 122, 0.12)',
                    },
                  }}
                >
                  Open search
                </Button>
              </Stack>
            </Alert>
          )}

          {showDataError && (
            <Alert
              color="red"
              title="We hit a snag fetching the latest weather"
              withCloseButton
              onClose={clearErrors}
              data-testid="fetch-error-alert"
            >
              {errors.points || errors.forecast || errors.hourly || errors.alerts}
            </Alert>
          )}

          <Stack gap="sm" align="center" mb="xs">
            <Title order={1} ta="center" mt={4} mb={0}>
              Forecast for{' '}
              {locationLabel ? (
                locationLabel
              ) : (
                <Skeleton
                  width={180}
                  height={20}
                  radius="xl"
                  display="inline-block"
                  data-testid="location-skeleton"
                  style={{ verticalAlign: 'middle' }}
                />
              )}
            </Title>
          </Stack>

          <SummarySection
            summary={summary}
            alerts={activeAlerts}
            hourlyPeriods={hourlyPeriods ?? null}
          />

          <HourlyForecastSection hourlyPeriods={hourlyPeriods} />
        </Stack>
      </AppShell.Main>

      <LocationSearchButton
        opened={isSearchOpen}
        onOpen={() => {
          closeRadar();
          openSearch();
        }}
        onClose={closeSearch}
        onLocationSelect={(lat, lon, label) => setCoordinates(lat, lon, label)}
      />
      <Suspense fallback={null}>
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
      </Suspense>
    </AppShell>
  );
}
