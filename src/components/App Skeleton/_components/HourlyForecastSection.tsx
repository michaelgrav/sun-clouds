import { Card, Skeleton, Stack, Title } from '@mantine/core';
import { filterActivePeriods } from '../../../../lib/weather/filterActivePeriods';
import { HourlyForecastSectionProps } from '../../../../types/appSkeleton';
import ForecastLineChart from './ForecastLineChart';
import { HourlyTables } from './HourlyTables';

export const HourlyForecastSection = ({
  hourlyPeriods,
  locationLabel,
}: HourlyForecastSectionProps) => {
  const activeHourlyPeriods = filterActivePeriods(hourlyPeriods ?? []);
  const hasActiveHourlyData = activeHourlyPeriods.length > 0;

  return (
    <>
      <Stack gap="sm" align="center" mb="md">
        <Title order={1} ta="center" mt={10} mb={4}>
          Hourly Forecast for{' '}
          {locationLabel ? (
            locationLabel
          ) : (
            <Skeleton
              width={160}
              height={18}
              radius="xl"
              display="inline-block"
              data-testid="location-skeleton"
              style={{ verticalAlign: 'middle' }}
            />
          )}
        </Title>
      </Stack>

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
