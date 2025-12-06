import { Card, Divider, ScrollArea, Skeleton, Stack, Text, Title } from '@mantine/core';
import { Period } from '../../../../types/weather';

interface DailyForecastCardsProps {
  periods?: Period[];
}

export const DailyForecastCards = ({ periods }: DailyForecastCardsProps) => {
  if (!periods) {
    return (
      <ScrollArea h="100%" offsetScrollbars>
        <Title order={5} ta="center" mt={25} mb={15}>
          7-Day Forecast
        </Title>

        <Stack gap="md" data-testid="daily-skeleton" px="xs">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((index) => (
            <Card
              key={index}
              shadow="xs"
              padding="md"
              radius="md"
              withBorder
              mb="8"
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <Skeleton height={14} width="50%" radius="sm" />
              <Divider my="xs" />
              <Skeleton height={10} width="70%" radius="sm" />
              <Skeleton height={10} width="60%" radius="sm" />
              <Skeleton height={10} width="90%" radius="sm" />
            </Card>
          ))}
        </Stack>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Title order={5} ta="center" mt={25} mb={15}>
        7-Day Forecast
      </Title>

      {periods.map((period) => (
        <Card
          shadow="xs"
          padding="md"
          radius="md"
          withBorder
          mb="35"
          ml="10"
          key={period.name}
          style={{ display: 'flex', flexDirection: 'column', height: 'auto', overflow: 'visible' }}
        >
          <Text size="md" ta="center">
            {period.name}
          </Text>

          <Divider my="xs" />

          <Text size="xs">🌡️ Average Temp: {period.temperature || 'NO AVERAGE TEMP??'}</Text>
          <Text size="xs" mb="xs">
            🍃 Wind Speed: {period.windSpeed || 'NO WIND SPEED??'}
          </Text>

          <Text size="xs">
            {period.detailedForecast ||
              "No summary available :( I guess you're gonna have to look outside..."}
          </Text>
        </Card>
      ))}

      <Text ta="center">You found the secret sun! 🌞</Text>
    </ScrollArea>
  );
};
