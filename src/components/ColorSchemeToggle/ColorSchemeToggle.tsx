import { MantineColorScheme, NativeSelect, useMantineColorScheme } from '@mantine/core';

const colorOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <NativeSelect
      variant="filled"
      radius="xl"
      size="xs"
      label="Color Theme"
      onChange={(event) => setColorScheme(event.currentTarget.value as MantineColorScheme)}
      data={colorOptions}
    />
  );
}
