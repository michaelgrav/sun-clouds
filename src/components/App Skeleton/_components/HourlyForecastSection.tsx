import { Card, Skeleton, Stack } from '@mantine/core';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import { HourlyForecastSectionProps } from '../../../../types/appSkeleton';
import ForecastLineChart from './ForecastLineChart';
import { HourlyTables } from './HourlyTables';

export const HourlyForecastSection = ({ hourlyPeriods }: HourlyForecastSectionProps) => {
  const activeHourlyPeriods = filterActivePeriods(hourlyPeriods ?? []);
  const hasActiveHourlyData = activeHourlyPeriods.length > 0;

  return (
    <>
      <ForecastLineChart data={activeHourlyPeriods} />

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

export default HourlyForecastSection;
