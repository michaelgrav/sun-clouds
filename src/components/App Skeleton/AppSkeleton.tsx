import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AppShell, Burger, Card, Center, Divider, Group, Loader, Table, Text, Title } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function AppSkeleton() {
  const [opened, { toggle }] = useDisclosure();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [hourlyWeatherForecast, setHourlyWeatherForecast] = useState<any>(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    function error() {
      console.error('Sorry, no position available.');
    }

    function success(position: any) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  const didFetchRef = useRef({ done: false });

  const isSmall = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }
    if (didFetchRef.current.done) {
      return;
    }

    const fetchWeather = async () => {
      try {
        const pointsRes = await axios.get(
          `https://api.weather.gov/points/${latitude},${longitude}`
        );
        setWeatherData(pointsRes.data);

        const forecastUrl = pointsRes.data?.properties?.forecast;
        const hourlyForecastUrl = pointsRes.data?.properties?.forecastHourly;
        if (forecastUrl) {
          const forecastRes = await axios.get(forecastUrl);
          setWeatherForecast(forecastRes.data);
        }
        if (hourlyForecastUrl) {
          const hourlyForecastRes = await axios.get(hourlyForecastUrl);
          setHourlyWeatherForecast(hourlyForecastRes.data);
        }

        didFetchRef.current.done = true;
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const dailyCards = weatherForecast?.properties?.periods.slice(1).map((period: any) => (
    <Card
      shadow="xs"
      padding="md"
      radius="md"
      withBorder
      mb="35"
      ml="10"
      mr="10"
      key={period.name}
      style={{ display: 'flex', flexDirection: 'column', height: 'auto', overflow: 'visible' }}
    >
      <Card.Section>
        <Text size="md" mb="xs" ta="center">
          {period.name}
        </Text>
      </Card.Section>

      <Text size="xs" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {period.detailedForecast ||
          'No summary available :( I guess you\'re gonna have to look outside...'}
      </Text>
    </Card>
  ));

  const formatHour = (iso?: string) => {
    if (!iso) {
      return '';
    }
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch (e) {
      return iso;
    }
  };

  const hourlyRows = hourlyWeatherForecast?.properties?.periods.map((period: any) => (
    <Table.Tr key={period.startTime}>
      <Table.Td>{formatHour(period.startTime)}</Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        {period.probabilityOfPrecipitation?.value != null
          ? `${period.probabilityOfPrecipitation.value}%`
          : ''}
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        {period.temperature != null ? `${period.temperature}${period.temperatureUnit}` : ''}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
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
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size={isSmall ? 'md' : 'xl'} ml={isSmall ? 0 : 10}>
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
          >
            <ColorSchemeToggle/>
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Title order={5} ta="center" mt={25} mb={15}>
          7-Day Forecast
        </Title>

        {/* return loading circle conditionally if the API call hasn't returned yet */}
        {dailyCards ? (
          dailyCards
        ) : (
          <Center>
            <Loader color="yellow" mt={20} />
          </Center>
        )}

        {/* <ColorSchemeToggle/> */}
      </AppShell.Navbar>

      <AppShell.Main>
      {hourlyRows ? (
        <>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="35">
            <Card.Section>
              <Text size="lg" mt="md" mb="xs" ta="center">
                Current Weather Summary
              </Text>
            </Card.Section>

            <Text size="sm">
              {weatherForecast?.properties?.periods[0]?.detailedForecast ||
                'No summary available :( I guess you\'re gonna have to look outside...'}
            </Text>
          </Card>

          <Divider my="md" variant="dotted" size="md"/>

          <Title order={1} ta="center" mt={25} mb={15}>
            Hourly Forecast {weatherData
                ? `for ${weatherData?.properties?.relativeLocation?.properties?.city}, ${weatherData?.properties?.relativeLocation?.properties?.state}`
                : 'for '}
          </Title>
          
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Time</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Rain Chance</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Temperature</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{hourlyRows}</Table.Tbody>
            </Table>
          </>
        ) : (
          <Center>
            <Loader color="yellow" size="xl" mt={20} />
          </Center>
        )}

        {/* Table for the hourly forecast */}
      </AppShell.Main>
    </AppShell>
  );
}
