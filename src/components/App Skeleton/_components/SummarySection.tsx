import { Card, Skeleton } from '@mantine/core';
import { SummarySectionProps } from '../../../../types/appSkeleton';
import { CurrentSummaryCard } from './CurrentSummaryCard';
import WeatherAlertsCard from './WeatherAlertsCard';

export const SummarySection = ({ summary, alerts }: SummarySectionProps) => (
  <>
    <WeatherAlertsCard alerts={alerts} />
    {summary ? <CurrentSummaryCard summary={summary} /> : <SummarySkeleton />}
  </>
);

export const SummarySkeleton = () => (
  <Card shadow="sm" padding="lg" radius="md" withBorder mb="35" data-testid="summary-skeleton">
    <Skeleton height={18} width="45%" mb="sm" radius="sm" />
    <Skeleton height={12} width="92%" mb={8} radius="sm" />
    <Skeleton height={12} width="88%" mb={8} radius="sm" />
    <Skeleton height={12} width="80%" radius="sm" />
  </Card>
);

export default SummarySection;
