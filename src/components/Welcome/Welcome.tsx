import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AppShell, Burger, Table, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

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

  useEffect(() => {
    if (latitude == null || longitude == null) {return;}
    if (didFetchRef.current.done) {return;}

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
      <Table.Td>{period.temperature + period.temperatureUnit}</Table.Td>
    </Table.Tr>
  ));

  const formatHour = (iso?: string) => {
    if (!iso) {return '';}
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
      <Table.Td>{period.temperature + period.temperatureUnit}</Table.Td>
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
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>Sun Clouds</div>
        <div>
          Forecast for {weatherData?.properties?.relativeLocation?.properties?.city},
          {weatherData?.properties?.relativeLocation?.properties?.state}
        </div>
      </AppShell.Header>

      <AppShell.Navbar>
        <Title order={5} ta="center" mt={50}>
          7-Day Forecast
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Day</Table.Th>
              <Table.Th>Temperature</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{dailyRows}</Table.Tbody>
        </Table>
      </AppShell.Navbar>

      <AppShell.Main>
        <Title order={1} ta="center" mt={50}>
          Hourly Forecast
        </Title>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Time</Table.Th>
              <Table.Th>Temperature</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{hourlyRows}</Table.Tbody>
        </Table>

        {/* Table for the hourly forecast */}
      </AppShell.Main>
    </AppShell>
  );
}
