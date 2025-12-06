import { lazy, Suspense, useMemo } from 'react';
import { Card, Skeleton, Stack } from '@mantine/core';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import { HourlyForecastSectionProps } from '../../../../types/appSkeleton';
import { HourlyTables } from './HourlyTables';

const ForecastLineChart = lazy(() => import('./ForecastLineChart'));

export const HourlyForecastSection = ({ hourlyPeriods }: HourlyForecastSectionProps) => {
  const activeHourlyPeriods = useMemo(
    () => filterActivePeriods(hourlyPeriods ?? []),
    [hourlyPeriods]
  );
  const hasActiveHourlyData = activeHourlyPeriods.length > 0;

  return (
    <>
      <Suspense fallback={<ForecastLineChartSkeleton />}>
        <ForecastLineChart data={activeHourlyPeriods} />
      </Suspense>

      {hasActiveHourlyData ? (
        <HourlyTables periods={activeHourlyPeriods} />
      ) : (
        <HourlyTablesSkeleton />
      )}
    </>
  );
};

export const HourlyTablesSkeleton = () => (
  <Stack gap="md" data-testid="hourly-table-skeletons" mt="md">
    {[0, 1].map((key) => (
      <Card key={key} shadow="sm" padding="md" radius="md" withBorder mb="6">
        <Skeleton height={16} width="35%" mb="sm" radius="sm" />
        <Stack gap={8}>
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} height={12} radius="sm" />
          ))}
        </Stack>
      </Card>
    ))}
  </Stack>
);

function ForecastLineChartSkeleton() {
  return (
    <Stack gap="md" data-testid="forecast-line-suspense" mb="xl">
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Skeleton height={18} width="40%" mb="sm" radius="sm" />
        <Skeleton height={280} radius="md" />
      </Card>
    </Stack>
  );
}

export default HourlyForecastSection;
