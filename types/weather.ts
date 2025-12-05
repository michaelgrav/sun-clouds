export interface RelativeLocation {
  properties?: {
    city?: string;
    state?: string;
  };
}

export interface PointsProperties {
  forecast?: string;
  forecastHourly?: string;
  relativeLocation?: RelativeLocation;
}

export interface PointsResponse {
  properties?: PointsProperties;
}

export interface PrecipitationProbability {
  value: number | null;
}

export interface Period {
  startTime: string;
  name?: string;
  detailedForecast?: string;
  probabilityOfPrecipitation?: PrecipitationProbability;
  temperature?: number | null;
  temperatureUnit?: string;
  windSpeed: string | null;
}

export interface ForecastProperties {
  periods: Period[];
}

export interface ForecastResponse {
  properties?: ForecastProperties;
}
