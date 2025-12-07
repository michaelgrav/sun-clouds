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
import { getDayPhase } from '../../../../lib/time/getDayPhase';
import { Period } from '../../../../types/weather';

interface DailyForecastCardsProps {
  periods?: Period[];
}

export const DailyForecastCards = ({ periods }: DailyForecastCardsProps) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const navbarSurface = 'var(--app-bg, #f7fbff)';

  const shellStyle = {
    background:
      colorScheme === 'dark'
        ? 'linear-gradient(135deg, #162235 0%, #0e1724 100%)'
        : 'linear-gradient(135deg, #fff9e6 0%, #e8f5ff 100%)',
    border: `1px solid ${colorScheme === 'dark' ? 'rgba(140, 199, 255, 0.35)' : '#a9d4ff'}`,
    boxShadow:
      colorScheme === 'dark'
        ? '0 10px 28px rgba(0, 0, 0, 0.35)'
        : '0 10px 26px rgba(10, 68, 122, 0.12)',
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
    background:
      colorScheme === 'dark'
        ? 'linear-gradient(135deg, #101826 0%, #0c1420 100%)'
        : 'linear-gradient(135deg, #fef3d6 0%, #e3f0ff 100%)',
    border: `1px solid ${colorScheme === 'dark' ? 'rgba(140, 199, 255, 0.25)' : '#a9d4ff'}`,
    boxShadow:
      colorScheme === 'dark' ? '0 8px 20px rgba(0,0,0,0.32)' : '0 8px 18px rgba(10, 68, 122, 0.08)',
  } as const;

  const renderName = (period: Period) => {
    const phase = getDayPhase(period.startTime);
    if (period.name) {
      return phase ? `${period.name} · ${phase}` : period.name;
    }
    return phase ? phase : '—';
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
      styles={{
        viewport: { background: navbarSurface, padding: 0 },
        scrollbar: { backgroundColor: 'transparent' },
      }}
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
              key={period.startTime ?? period.name ?? 'period'}
              style={{ ...cardStyle, height: 'auto' }}
            >
              <Text
                size="md"
                ta="center"
                fw={700}
                c={colorScheme === 'dark' ? theme.colors.sky[0] : '#0b2a3a'}
              >
                {renderName(period)}
              </Text>

              <Divider my="xs" />

              <Text size="xs" c={colorScheme === 'dark' ? theme.colors.sky[1] : theme.black}>
                🌡️ Average Temp: {period.temperature || 'NO AVERAGE TEMP??'}
              </Text>
              <Text
                size="xs"
                mb="xs"
                c={colorScheme === 'dark' ? theme.colors.sky[1] : theme.black}
              >
                🍃 Wind Speed: {period.windSpeed || 'NO WIND SPEED??'}
              </Text>

              <Text size="xs" c={colorScheme === 'dark' ? theme.colors.sky[1] : theme.black}>
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
