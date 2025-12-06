import {
  Card,
  Divider,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Period } from '../../../../types/weather';

interface DailyForecastCardsProps {
  periods?: Period[];
}

export const DailyForecastCards = ({ periods }: DailyForecastCardsProps) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const navbarSurface = 'var(--app-bg, #f7fbff)';

  const containerBackground =
    colorScheme === 'dark'
      ? `linear-gradient(135deg, rgba(255, 212, 108, 0.1), rgba(255, 180, 41, 0.18))`
      : `linear-gradient(135deg, ${theme.colors.sunshine[0]}, ${theme.colors.sunshine[2]})`;

  const containerBorder =
    colorScheme === 'dark'
      ? '1px solid rgba(255, 212, 108, 0.22)'
      : `1px solid ${theme.colors.sunshine[3]}`;

  const containerShadow =
    colorScheme === 'dark'
      ? '0 10px 28px rgba(0, 0, 0, 0.35)'
      : '0 10px 26px rgba(255, 180, 41, 0.25)';

  const shellStyle = {
    background: containerBackground,
    border: containerBorder,
    boxShadow: containerShadow,
    borderRadius: 0,
    padding: '10px 12px 16px',
    minHeight: '100%',
    overflow: 'hidden',
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    overflow: 'visible',
  };

  if (!periods) {
    return (
      <ScrollArea
        h="100%"
        offsetScrollbars
        style={{ background: navbarSurface, height: '100%' }}
        styles={{
          viewport: { background: navbarSurface, padding: 0 },
          scrollbar: { backgroundColor: 'transparent' },
        }}
      >
        <div style={shellStyle}>
          <Title order={5} ta="center" mt={10} mb={12}>
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
                style={cardStyle}
              >
                <Skeleton height={14} width="50%" radius="sm" />
                <Divider my="xs" />
                <Skeleton height={10} width="70%" radius="sm" />
                <Skeleton height={10} width="60%" radius="sm" />
                <Skeleton height={10} width="90%" radius="sm" />
              </Card>
            ))}
          </Stack>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea
      h="100%"
      offsetScrollbars
      style={{ background: navbarSurface, height: '100%' }}
      styles={{ viewport: { background: navbarSurface, padding: 0 }, scrollbar: { backgroundColor: 'transparent' } }}
    >
      <div style={shellStyle}>
        <Title order={5} ta="center" mt={10} mb={12}>
          7-Day Forecast
        </Title>

        <Stack gap="md" px="xs">
          {periods.map((period) => (
            <Card
              shadow="xs"
              padding="md"
              radius="md"
              withBorder
              key={period.name}
              style={{ ...cardStyle, height: 'auto' }}
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
        </Stack>

        <Text ta="center" mt={14}>
          You found the secret sun! 🌞
        </Text>
      </div>
    </ScrollArea>
  );
};
