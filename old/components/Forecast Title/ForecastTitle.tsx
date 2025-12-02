import Typography from '@mui/material/Typography';
import './ForecastTitle.css'

function ForecastTitle({city, state}: {city: string, state: string}) {
  return (
    <Typography variant="h3">
        7-Day Weather Forecast for {' '}
        {city}, 
        {state}
    </Typography>
  )
}

export default ForecastTitle