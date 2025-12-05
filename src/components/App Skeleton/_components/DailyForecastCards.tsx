import { Card, Center, Divider, Loader, ScrollArea, Text, Title } from '@mantine/core';
import { Period } from '../../../../types/weather';

interface DailyForecastCardsProps {
  periods?: Period[];
}

export const DailyForecastCards = ({ periods }: DailyForecastCardsProps) => {
  if (!periods) {
    return (
      <Center>
        <Loader color="yellow" mt={20} data-testid="daily-loader" />
      </Center>
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
    </ScrollArea>
  );
};
