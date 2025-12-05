import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AppShell, Burger, Center, Loader, Skeleton, Table, Title, Text, Group } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

export function Welcome() {
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

  const dailyRows = weatherForecast?.properties?.periods.map((period: any) => (
    <Table.Tr key={period.name}>
      <Table.Td>{period.name}</Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>{period.temperature + period.temperatureUnit}</Table.Td>
    </Table.Tr>
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
      <Table.Td style={{ textAlign: 'right' }}>{period.probabilityOfPrecipitation?.value != null ? period.probabilityOfPrecipitation.value + '%' : ''}</Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>{period.temperature != null ? period.temperature + period.temperatureUnit : ''}</Table.Td>
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
        <Group style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <Group style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="lg" ml={10}>Sun Clouds</Text>
          </Group>

          <Text
            size={isSmall ? 'sm' : 'lg'}
            ta="right"
            mr={10}
            style={{
              textAlign: 'right',
              maxWidth: isSmall ? '60%' : 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {weatherData
              ? `Forecast for ${weatherData?.properties?.relativeLocation?.properties?.city}, ${weatherData?.properties?.relativeLocation?.properties?.state}`
              : ''}
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>

        <Title order={5} ta="center" mt={25} mb={15}>
          7-Day Forecast
        </Title>

        {/* return loading circle conditionally if the API call hasnt returned yet */}
        { dailyRows ?
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Day</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Temperature</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{dailyRows}</Table.Tbody>
        </Table> :

        <Center>
          <Loader color="yellow" mt={20}/>
        </Center>
        }
      </AppShell.Navbar>

      <AppShell.Main>
        <Title order={1} ta="center" mt={5} mb={15}>
          Hourly Forecast
        </Title>

        {/* return loading circle conditionally if the API call hasnt returned yet */}
        { hourlyRows ? 

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
        :

        <Center>
          <Loader color="yellow" size="lg" mt={20}/>
        </Center>
        }

        {/* Table for the hourly forecast */}
      </AppShell.Main>
    </AppShell>
  );
}
