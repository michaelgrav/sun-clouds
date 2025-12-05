import { Card, List, Stack, Text } from '@mantine/core';
import { AlertFeature } from '../../../../types/weather';

interface WeatherAlertsCardProps {
  alerts?: AlertFeature[];
}

export const WeatherAlertsCard = ({ alerts }: WeatherAlertsCardProps) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mb="md"
      style={{
        backgroundColor: 'var(--mantine-color-red-0, #fff0f0)',
        borderColor: 'var(--mantine-color-red-4, #f03e3e)',
      }}
    >
      <Card.Section px="md" pt="md" pb="sm">
        <Text size="lg" fw={700} c="red.7" ta="center">
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
                item: { color: 'var(--mantine-color-red-8)' },
                itemWrapper: { color: 'var(--mantine-color-red-8)' },
              }}
            >
              <List.Item>
                <Text fw={600} c="red.8">
                  {headline}
                </Text>
                <Text size="sm" c="red.9">
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
