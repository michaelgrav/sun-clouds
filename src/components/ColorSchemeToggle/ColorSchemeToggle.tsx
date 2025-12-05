import { useMantineColorScheme, NativeSelect } from '@mantine/core';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();

  return (
      <NativeSelect 
        variant="filled" 
        radius="xl" 
        size="xs"
        label="Color Theme" 
        onChange={(event) => setColorScheme(event.currentTarget.value.toString().toLowerCase())}
        data={[
        'Auto', 'Light', 'Dark'
      ]} />
  );
}
