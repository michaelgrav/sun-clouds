import {
  AppShell,
  Burger,
  Group,
  MantineTheme,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { AppHeaderProps } from '../../../../types/appSkeleton';
import { ColorSchemeToggle } from '../../ColorSchemeToggle/ColorSchemeToggle';

type BarStyles = {
  background: string;
  border: string;
  shadow: string;
};

const getBarStyles = (colorScheme: 'light' | 'dark', theme: MantineTheme): BarStyles => {
  const background =
    colorScheme === 'dark'
      ? `radial-gradient(circle at 18% 18%, ${theme.colors.sunshine[3]}33, transparent 42%), radial-gradient(circle at 78% 12%, ${theme.colors.sky[4]}33, transparent 40%), linear-gradient(135deg, ${theme.colors.sky[8]}, ${theme.colors.sunshine[6]})`
      : `radial-gradient(circle at 18% 18%, ${theme.colors.sunshine[3]}33, transparent 42%), radial-gradient(circle at 78% 12%, ${theme.colors.sky[4]}33, transparent 40%), linear-gradient(135deg, ${theme.colors.sky[1]}, ${theme.colors.sunshine[2]})`;

  const border =
    colorScheme === 'dark'
      ? `1px solid ${theme.colors.sky[7]}`
      : `1px solid ${theme.colors.sky[2]}`;

  const shadow =
    colorScheme === 'dark'
      ? '0 6px 18px rgba(0, 0, 0, 0.45)'
      : '0 6px 18px rgba(255, 180, 41, 0.25)';

  return { background, border, shadow };
};

export const AppHeader = ({ opened, onToggle, isSmallScreen }: AppHeaderProps) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const { background, border, shadow } = getBarStyles(colorScheme, theme);

  return (
    <AppShell.Header style={{ background, borderBottom: border, boxShadow: shadow }}>
      <Group
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          padding: '0.25rem 0.75rem',
        }}
      >
        <Group style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Burger
            opened={opened}
            onClick={onToggle}
            size="sm"
            ml="xs"
            style={{ alignSelf: 'center' }}
            aria-label="Toggle navigation"
          />
          <Text size={isSmallScreen ? 'md' : 'xl'} component="div" mt={-2}>
            ☀️ Sun Clouds ☁️
          </Text>
        </Group>

        <Text
          size={isSmallScreen ? 'sm' : 'xl'}
          ta="right"
          mr={10}
          mt={-10}
          style={{
            textAlign: 'right',
          }}
          component="div"
        >
          <ColorSchemeToggle />
        </Text>
      </Group>
    </AppShell.Header>
  );
};

export default AppHeader;
