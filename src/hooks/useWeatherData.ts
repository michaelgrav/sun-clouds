import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AlertsResponse, ForecastResponse, PointsResponse } from '../../types/weather';

interface WeatherState {
  weatherData: PointsResponse | null;
  weatherForecast: ForecastResponse | null;
  hourlyWeatherForecast: ForecastResponse | null;
  activeAlerts: AlertsResponse['features'];
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  setCoordinates: (lat: number, lon: number) => void;
}

export const useWeatherData = (): WeatherState => {
  const [weatherData, setWeatherData] = useState<PointsResponse | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<ForecastResponse | null>(null);
  const [hourlyWeatherForecast, setHourlyWeatherForecast] = useState<ForecastResponse | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<AlertsResponse['features']>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastZoneRef = useRef<string | null>(null);

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const handleError = () => {
      // eslint-disable-next-line no-console
      console.error('Sorry, no position available.');
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const pointsRes = await axios.get<PointsResponse>(
          `https://api.weather.gov/points/${latitude},${longitude}`,
          { signal: controller.signal }
        );
        setWeatherData(pointsRes.data);

        const forecastUrl = pointsRes.data?.properties?.forecast;
        const hourlyForecastUrl = pointsRes.data?.properties?.forecastHourly;
        const forecastZoneUrl = pointsRes.data?.properties?.forecastZone;
        const zoneId = forecastZoneUrl?.split('/').pop();

        if (forecastUrl) {
          const forecastRes = await axios.get<ForecastResponse>(forecastUrl, {
            signal: controller.signal,
          });
          setWeatherForecast(forecastRes.data);
        }

        if (hourlyForecastUrl) {
          const hourlyForecastRes = await axios.get<ForecastResponse>(hourlyForecastUrl, {
            signal: controller.signal,
          });
          setHourlyWeatherForecast(hourlyForecastRes.data);
        }

        if (zoneId && zoneId !== lastZoneRef.current) {
          const alertsRes = await axios.get<AlertsResponse>(
            `https://api.weather.gov/alerts/active/zone/${zoneId}`,
            { signal: controller.signal }
          );
          setActiveAlerts(alertsRes.data.features ?? []);
          lastZoneRef.current = zoneId;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [latitude, longitude]);

  const setCoordinates = (lat: number, lon: number) => {
    setIsLoading(true);
    setWeatherData(null);
    setWeatherForecast(null);
    setHourlyWeatherForecast(null);
    setActiveAlerts([]);
    lastZoneRef.current = null;
    setLatitude(lat);
    setLongitude(lon);
  };

  return {
    weatherData,
    weatherForecast,
    hourlyWeatherForecast,
    activeAlerts,
    latitude,
    longitude,
    isLoading,
    setCoordinates,
  };
};
