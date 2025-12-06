import { Card, List, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { AlertFeature } from '../../../../types/weather';

interface WeatherAlertsCardProps {
  alerts?: AlertFeature[];
}

export const WeatherAlertsCard = ({ alerts }: WeatherAlertsCardProps) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark
    ? 'var(--mantine-color-red-10, #7f1d1dff)'
    : 'var(--mantine-color-red-0, #fff0f0)';
  const borderColor = isDark
    ? 'var(--mantine-color-red-7, #f03e3e)'
    : 'var(--mantine-color-red-4, #f03e3e)';
  const headingColor = isDark ? 'red.1' : 'red.7';
  const headlineColor = isDark ? 'red.1' : 'red.8';
  const detailColor = isDark ? 'red.2' : 'red.9';
  const bulletColor = isDark ? 'var(--mantine-color-red-2)' : 'var(--mantine-color-red-8)';

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mb="md"
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <Card.Section px="md" pt="md" pb="sm">
        <Text size="lg" fw={700} c={headingColor} ta="center">
          Active Weather Alerts
        </Text>
      </Card.Section>

      <Stack gap="sm">
        {alerts.map((alert) => {
          const headline = alert.properties?.headline ?? 'Weather Alert';
          const detail =
            alert.properties?.description ??
            alert.properties?.instruction ??
            'Stay informed and safe.';

          return (
            <List
              key={alert.id ?? headline}
              spacing="xs"
              center
              listStyleType="disc"
              withPadding
              styles={{
                item: { color: bulletColor },
                itemWrapper: { color: bulletColor },
              }}
            >
              <List.Item>
                <Text fw={600} c={headlineColor}>
                  {headline}
                </Text>
                <Text size="sm" c={detailColor}>
                  {detail}
                </Text>
              </List.Item>
            </List>
          );
        })}
      </Stack>
    </Card>
  );
};

export default WeatherAlertsCard;
