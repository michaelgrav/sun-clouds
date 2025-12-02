import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);

  useEffect(() => {
    // First API call has the links to the forecast and hourly forecast
    axios.get('https://api.weather.gov/points/37.5694,-77.4755')
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error(error)
      });
  }, []);

  useEffect(() => {
    // Make second API call to get the actual weather data
    axios.get(weatherData?.properties?.forecast)
      .then(response => {
        setWeatherForecast(response.data);
      })
      .catch(error => {
        console.error(error)
      });  
    
  }, [weatherData]);

  console.log(weatherForecast)

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="daily forecast table">
          <TableHead>
            <TableRow>
              <TableCell>Day</TableCell>
              <TableCell align="right">Forecast</TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {weatherForecast?.properties?.periods?.map((period) => (
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
    </>
  )
}

export default App
