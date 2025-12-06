import type { AlertFeature, Period } from './weather';

export interface AppHeaderProps {
  opened: boolean;
  onToggle: () => void;
  isSmallScreen: boolean;
}

export interface SummarySectionProps {
  summary?: string | null;
  alerts?: AlertFeature[];
  hourlyPeriods?: Period[] | null;
}

export interface HourlyForecastSectionProps {
  hourlyPeriods?: Period[] | null;
}
