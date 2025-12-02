import { useEffect, useState, useRef } from 'react'
import './App.css'
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ForecastTitle from './components/Forecast Title/ForecastTitle';
import TopBar from './components/Top Bar/TopBar';

function App() {
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
    <TopBar />
      <div>
        <ForecastTitle 
          city={weatherData?.properties?.relativeLocation?.properties?.city}
          state={weatherData?.properties?.relativeLocation?.properties?.state}
        />

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="daily forecast table">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell align="right">Forecast</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {weatherForecast?.properties?.periods?.map((period: any) => (
                <TableRow
                  key={period.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {period.name}
                  </TableCell>
                  <TableCell align="right">{period.detailedForecast}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

export default App
