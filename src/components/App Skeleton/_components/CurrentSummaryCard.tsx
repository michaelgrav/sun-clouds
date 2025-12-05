import { Card, Text } from '@mantine/core';

interface CurrentSummaryCardProps {
  summary?: string;
}

export const CurrentSummaryCard = ({ summary }: CurrentSummaryCardProps) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder mb="35">
    <Card.Section>
      <Text size="lg" mt="md" mb="xs" ta="center">
        Current Weather Summary
      </Text>
    </Card.Section>

    <Text size="sm" ta="center">
      {summary || "No summary available :( I guess you're gonna have to look outside..."}
    </Text>
  </Card>
);
