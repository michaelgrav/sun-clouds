import type { AlertFeature, Period } from './weather';

export interface AppHeaderProps {
  opened: boolean;
  onToggle: () => void;
  isSmallScreen: boolean;
}

export interface SummarySectionProps {
  summary?: string | null;
  alerts?: AlertFeature[];
}

export interface HourlyForecastSectionProps {
  hourlyPeriods?: Period[] | null;
  locationLabel: string | null;
  hasHourlyData: boolean;
}
