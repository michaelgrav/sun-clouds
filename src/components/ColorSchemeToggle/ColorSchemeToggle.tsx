import { IconMoon, IconShadow, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Group,
  MantineColorScheme,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

const modes: Array<{ value: MantineColorScheme; label: string; icon: React.ReactNode }> = [
  { value: 'auto', label: 'Auto (match system)', icon: <IconShadow size={18} stroke={1.8} /> },
  { value: 'light', label: 'Light', icon: <IconSun size={18} stroke={1.8} /> },
  { value: 'dark', label: 'Dark', icon: <IconMoon size={18} stroke={1.8} /> },
];

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const theme = useMantineTheme();

  const modalGradient =
    computed === 'dark'
      ? `linear-gradient(135deg, ${theme.colors.sky[8]}, ${theme.colors.sunshine[6]})`
      : `linear-gradient(135deg, ${theme.colors.sky[1]}, ${theme.colors.sunshine[2]})`;

  const accentWash = `radial-gradient(circle at 18% 18%, ${theme.colors.sunshine[3]}33, transparent 42%), radial-gradient(circle at 78% 12%, ${theme.colors.sky[4]}33, transparent 40%)`;

  return (
    <Group gap="xs" align="center" wrap="nowrap">
      {modes.map((mode) => {
        const isActive = colorScheme === mode.value;
        const intent = isActive ? 'filled' : 'default';

        return (
          <Tooltip key={mode.value} label={mode.label} withArrow>
            <ActionIcon
              variant={intent}
              size="lg"
              radius="xl"
              aria-pressed={isActive}
              aria-label={mode.label}
              onClick={() => setColorScheme(mode.value)}
              color={computed === 'dark' ? 'yellow' : 'blue'}
              style={{
                backgroundImage: `${accentWash}, ${modalGradient}`,
                border: `1px solid ${computed === 'dark' ? theme.colors.sky[6] : theme.colors.sky[2]}`,
                boxShadow:
                  computed === 'dark'
                    ? '0 10px 24px rgba(0,0,0,0.35)'
                    : '0 10px 24px rgba(43,142,247,0.18)',
              }}
            >
              {mode.icon}
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
