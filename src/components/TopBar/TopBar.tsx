import { Group, Text, useComputedColorScheme, useMantineTheme } from '@mantine/core';

export function TopBar() {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const background =
    colorScheme === 'dark'
      ? `linear-gradient(135deg, rgba(255, 212, 108, 0.12), rgba(255, 180, 41, 0.24))`
      : `linear-gradient(135deg, ${theme.colors.sunshine[0]}, ${theme.colors.sunshine[2]})`;

  const border =
    colorScheme === 'dark'
      ? '1px solid rgba(255, 212, 108, 0.25)'
      : `1px solid ${theme.colors.sunshine[3]}`;

  return (
    <header
      style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        padding: '0.85rem 1.1rem',
        background,
        borderBottom: border,
        boxShadow:
          colorScheme === 'dark'
            ? '0 6px 18px rgba(0, 0, 0, 0.45)'
            : '0 6px 18px rgba(255, 180, 41, 0.25)',
      }}
    >
      <Group justify="space-between" align="center">
        <Text fw={800} size="lg" style={{ letterSpacing: 0.4 }}>
          Sun & Clouds
        </Text>
        <Text size="sm" c={colorScheme === 'dark' ? theme.colors.sky[1] : theme.colors.sky[8]}>
          Seven day outlook
        </Text>
      </Group>
    </header>
  );
}

export default TopBar;
