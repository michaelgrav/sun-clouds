import { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    function error() {
      alert("Sorry, no position available.");
    }
    
    function success(position: any) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  const didFetchRef = useRef({ done: false });

  useEffect(() => {
    if (latitude == null || longitude == null) return;
    if (didFetchRef.current.done) return;

    const fetchWeather = async () => {
      try {
        const pointsRes = await axios.get(
          `https://api.weather.gov/points/${latitude},${longitude}`
        );
        setWeatherData(pointsRes.data);

        const forecastUrl = pointsRes.data?.properties?.forecast;
        if (forecastUrl) {
          const forecastRes = await axios.get(forecastUrl);
          setWeatherForecast(forecastRes.data);
        }

        didFetchRef.current.done = true;
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);


  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        7-Day Weather Forecast for {' '}
        {weatherData?.properties?.relativeLocation?.properties?.city}, 
        {weatherData?.properties?.relativeLocation?.properties?.state}
      </Title>
    </>
  );
}
