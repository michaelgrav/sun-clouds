import { Card, Text, useComputedColorScheme, useMantineTheme } from '@mantine/core';

interface CurrentSummaryCardProps {
  summary?: string;
}

export const CurrentSummaryCard = ({ summary }: CurrentSummaryCardProps) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const cardStyle = {
    background:
      colorScheme === 'dark'
        ? 'linear-gradient(135deg, #162235 0%, #0e1724 100%)'
        : 'linear-gradient(135deg, #fff9e6 0%, #e8f5ff 100%)',
    border: `1px solid ${colorScheme === 'dark' ? 'rgba(140, 199, 255, 0.35)' : '#a9d4ff'}`,
    boxShadow:
      colorScheme === 'dark'
        ? '0 10px 24px rgba(0,0,0,0.35)'
        : '0 8px 20px rgba(10, 68, 122, 0.08)',
  } as const;

  const headingColor = colorScheme === 'dark' ? theme.colors.sky[0] : '#0b2a3a';
  const bodyColor = colorScheme === 'dark' ? theme.colors.sky[1] : theme.black;

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder mb="35" style={cardStyle}>
      <Card.Section>
        <Text size="lg" mt="md" mb="xs" ta="center" fw={700} c={headingColor}>
          Current Weather Summary
        </Text>
      </Card.Section>

      <Text size="sm" ta="center" c={bodyColor}>
        {summary || "No summary available :( I guess you're gonna have to look outside..."}
      </Text>
    </Card>
  );
};
