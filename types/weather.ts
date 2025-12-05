export interface RelativeLocation {
  properties?: {
    city?: string;
    state?: string;
  };
}

export interface PointsProperties {
  forecast?: string;
  forecastHourly?: string;
  forecastZone?: string;
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

export interface AlertGeocode {
  UGC?: string[];
  SAME?: string[];
}

export interface AlertReference {
  '@id'?: string;
  identifier?: string;
  sender?: string;
  sent?: string;
}

export interface AlertProperties {
  id?: string;
  areaDesc?: string;
  geocode?: AlertGeocode;
  affectedZones?: string[];
  references?: AlertReference[];
  sent?: string;
  effective?: string;
  onset?: string;
  expires?: string;
  ends?: string;
  status?: string;
  messageType?: string;
  category?: string;
  severity?: string;
  certainty?: string;
  urgency?: string;
  event?: string;
  sender?: string;
  senderName?: string;
  headline?: string;
  description?: string;
  instruction?: string;
  response?: string;
  parameters?: Record<string, Array<string | null> | undefined>;
  scope?: string;
  code?: string;
  language?: string;
  web?: string;
  eventCode?: Record<string, Array<string | null> | undefined>;
}

export interface AlertFeature {
  id?: string;
  type?: string;
  properties?: AlertProperties;
}

export interface AlertsPagination {
  next?: string;
}

export interface AlertsResponse {
  type?: string;
  title?: string;
  updated?: string;
  pagination?: AlertsPagination;
  features?: AlertFeature[];
}
