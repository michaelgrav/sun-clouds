import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ForecastResponse, PointsResponse } from '../../types/weather';

interface WeatherState {
  weatherData: PointsResponse | null;
  weatherForecast: ForecastResponse | null;
  hourlyWeatherForecast: ForecastResponse | null;
  isLoading: boolean;
}

export const useWeatherData = (): WeatherState => {
  const [weatherData, setWeatherData] = useState<PointsResponse | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<ForecastResponse | null>(null);
  const [hourlyWeatherForecast, setHourlyWeatherForecast] = useState<ForecastResponse | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const didFetchRef = useRef({ done: false });

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const handleError = () => {
      console.error('Sorry, no position available.');
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }
    if (didFetchRef.current.done) {
      return;
    }

    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const pointsRes = await axios.get<PointsResponse>(
          `https://api.weather.gov/points/${latitude},${longitude}`
        );
        setWeatherData(pointsRes.data);

        const forecastUrl = pointsRes.data?.properties?.forecast;
        const hourlyForecastUrl = pointsRes.data?.properties?.forecastHourly;

        if (forecastUrl) {
          const forecastRes = await axios.get<ForecastResponse>(forecastUrl);
          setWeatherForecast(forecastRes.data);
        }

        if (hourlyForecastUrl) {
          const hourlyForecastRes = await axios.get<ForecastResponse>(hourlyForecastUrl);
          setHourlyWeatherForecast(hourlyForecastRes.data);
        }

        didFetchRef.current.done = true;
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return {
    weatherData,
    weatherForecast,
    hourlyWeatherForecast,
    isLoading,
  };
};
