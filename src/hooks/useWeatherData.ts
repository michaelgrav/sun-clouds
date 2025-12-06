import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AlertsResponse, ForecastResponse, PointsResponse } from '../../types/weather';

interface WeatherErrors {
  geolocation?: string;
  points?: string;
  forecast?: string;
  hourly?: string;
  alerts?: string;
}

interface WeatherState {
  weatherData: PointsResponse | null;
  weatherForecast: ForecastResponse | null;
  hourlyWeatherForecast: ForecastResponse | null;
  activeAlerts: AlertsResponse['features'];
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  errors: WeatherErrors;
  geolocationDenied: boolean;
  selectedLocationLabel?: string | null;
  setCoordinates: (lat: number, lon: number, label?: string | null) => void;
  clearErrors: () => void;
  dismissGeolocationWarning: () => void;
}

const buildErrorMessage = (fallback: string) => fallback;

export const useWeatherData = (): WeatherState => {
  const [weatherData, setWeatherData] = useState<PointsResponse | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<ForecastResponse | null>(null);
  const [hourlyWeatherForecast, setHourlyWeatherForecast] = useState<ForecastResponse | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<AlertsResponse['features']>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<WeatherErrors>({});
  const [geolocationDenied, setGeolocationDenied] = useState(false);
  const [selectedLocationLabel, setSelectedLocationLabel] = useState<string | null>(null);
  const lastZoneRef = useRef<string | null>(null);
  const lastCoordinatesRef = useRef<string | null>(null);

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const handleError = (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        setGeolocationDenied(true);
        setErrors((prev) => ({ ...prev, geolocation: 'Location permission was denied.' }));
      } else {
        setErrors((prev) => ({ ...prev, geolocation: 'Unable to access your location.' }));
      }
    };

    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        geolocation: 'Geolocation is not supported by this browser.',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }

    const coordinateKey = `${latitude},${longitude}`;
    if (coordinateKey === lastCoordinatesRef.current) {
      return;
    }
    lastCoordinatesRef.current = coordinateKey;

    const controller = new AbortController();

    const fetchWeather = async () => {
      setIsLoading(true);
      setErrors((prev) => ({
        ...prev,
        points: undefined,
        forecast: undefined,
        hourly: undefined,
        alerts: undefined,
      }));

      try {
        const pointsRes = await axios.get<PointsResponse>(
          `https://api.weather.gov/points/${latitude},${longitude}`,
          { signal: controller.signal }
        );
        setWeatherData(pointsRes.data);

        const forecastUrl = pointsRes.data?.properties?.forecast;
        const hourlyForecastUrl = pointsRes.data?.properties?.forecastHourly;
        const forecastZoneUrl = pointsRes.data?.properties?.forecastZone;
        const zoneId = forecastZoneUrl?.split('/').pop();

        const forecastPromise = forecastUrl
          ? axios.get<ForecastResponse>(forecastUrl, { signal: controller.signal })
          : null;
        const hourlyPromise = hourlyForecastUrl
          ? axios.get<ForecastResponse>(hourlyForecastUrl, { signal: controller.signal })
          : null;
        const alertsPromise = zoneId
          ? axios.get<AlertsResponse>(`https://api.weather.gov/alerts/active/zone/${zoneId}`, {
              signal: controller.signal,
            })
          : null;

        const [forecastResult, hourlyResult, alertsResult] = await Promise.allSettled([
          forecastPromise,
          hourlyPromise,
          alertsPromise,
        ]);

        if (forecastResult.status === 'fulfilled' && forecastResult.value) {
          setWeatherForecast(forecastResult.value.data);
        } else if (forecastPromise) {
          setErrors((prev) => ({
            ...prev,
            forecast: buildErrorMessage('Unable to fetch forecast data.'),
          }));
        }

        if (hourlyResult.status === 'fulfilled' && hourlyResult.value) {
          setHourlyWeatherForecast(hourlyResult.value.data);
        } else if (hourlyPromise) {
          setErrors((prev) => ({
            ...prev,
            hourly: buildErrorMessage('Unable to fetch hourly data.'),
          }));
        }

        if (alertsResult.status === 'fulfilled' && alertsResult.value) {
          setActiveAlerts(alertsResult.value.data.features ?? []);
          lastZoneRef.current = zoneId ?? null;
        } else if (alertsPromise) {
          setErrors((prev) => ({
            ...prev,
            alerts: buildErrorMessage('Unable to load alerts for this area.'),
          }));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrors((prev) => ({
            ...prev,
            points: buildErrorMessage('Unable to load location data.'),
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [latitude, longitude]);

  const setCoordinates = (lat: number, lon: number, label?: string | null) => {
    setIsLoading(true);
    setWeatherData(null);
    setWeatherForecast(null);
    setHourlyWeatherForecast(null);
    setActiveAlerts([]);
    setSelectedLocationLabel(label ?? null);
    lastZoneRef.current = null;
    lastCoordinatesRef.current = null;
    setLatitude(lat);
    setLongitude(lon);
  };

  const clearErrors = () => setErrors({});

  const dismissGeolocationWarning = () => {
    setGeolocationDenied(false);
    setErrors((prev) => ({ ...prev, geolocation: undefined }));
  };

  return {
    weatherData,
    weatherForecast,
    hourlyWeatherForecast,
    activeAlerts,
    latitude,
    longitude,
    isLoading,
    errors,
    geolocationDenied,
    selectedLocationLabel,
    setCoordinates,
    clearErrors,
    dismissGeolocationWarning,
  };
};
